/**
 * Buffer Social Media Automation Library
 * Integrates with Buffer Publish API to schedule & publish social posts
 * for Raggio Gourmet & Pizza.
 */

export interface BufferPostPayload {
  text: string;
  media?: {
    photo?: string;
    thumbnail?: string;
    description?: string;
  };
  now?: boolean;
  scheduled_at?: string;
}

export interface BufferPostResponse {
  success: boolean;
  message?: string;
  updates?: unknown[];
}

export async function scheduleBufferPost(payload: BufferPostPayload): Promise<BufferPostResponse> {
  const accessToken = process.env.BUFFER_ACCESS_TOKEN;
  const profileId = process.env.BUFFER_PROFILE_ID;

  if (!accessToken || !profileId) {
    return {
      success: false,
      message: 'Buffer credentials missing: BUFFER_ACCESS_TOKEN or BUFFER_PROFILE_ID not configured.',
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('text', payload.text);
    formData.append('profile_ids[]', profileId);
    
    if (payload.now) {
      formData.append('now', 'true');
    }
    if (payload.scheduled_at) {
      formData.append('scheduled_at', payload.scheduled_at);
    }
    if (payload.media?.photo) {
      formData.append('media[photo]', payload.media.photo);
    }
    if (payload.media?.description) {
      formData.append('media[description]', payload.media.description);
    }

    const response = await fetch('https://api.bufferapp.com/1/updates/create.json', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Buffer API error status ${response.status}`,
      };
    }

    return {
      success: true,
      updates: data.updates,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown Buffer error',
    };
  }
}
