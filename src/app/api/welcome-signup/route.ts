import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwe23dYVGbmlt56kJhIw7RV_8VO2EnqhdXRzqau3e65mYpDItW6ggp8YX-4rzxtdHIv/exec';

const RATE_LIMIT_WINDOW_MS = 600_000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 signup attempts per 10 mins per IP
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  if (rateLimitMap.size > 500) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  const entry = rateLimitMap.get(identifier);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(identifier, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many signup attempts. Please try again in 10 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedName = String(name).trim();
    const cleanPhone = String(phone).replace(/[^0-9]/g, '');

    // Input bounds and format validation
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid name (2-100 characters).' },
        { status: 400 }
      );
    }

    if (trimmedEmail.length > 150 || !EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid phone number (10-15 digits).' },
        { status: 400 }
      );
    }

    const targetUrl = process.env.GOOGLE_SCRIPT_URL || DEFAULT_SCRIPT_URL;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        phone: cleanPhone,
      }),
      redirect: 'follow',
    });

    const data = await response.json().catch(() => null);

    // Google Apps Script returns: { result: "success", message: "duplicate ignored" }
    const isDuplicate =
      data?.message?.toLowerCase().includes('duplicate') ||
      data?.result === 'duplicate' ||
      false;

    return NextResponse.json({
      success: true,
      isDuplicate,
      data,
    });
  } catch (error) {
    console.error('Welcome signup proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process registration.' },
      { status: 500 }
    );
  }
}
