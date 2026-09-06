import { NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwe23dYVGbmlt56kJhIw7RV_8VO2EnqhdXRzqau3e65mYpDItW6ggp8YX-4rzxtdHIv/exec';

export async function POST(req: Request) {
  try {
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

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        phone: cleanPhone || phone,
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
