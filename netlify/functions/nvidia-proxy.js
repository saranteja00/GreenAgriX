// Netlify Serverless Function: /netlify/functions/nvidia-proxy.js
// Acts as a secure server-side proxy for the NVIDIA NIM API
// Prevents CORS issues when called from the browser on Netlify

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const NVIDIA_API_KEY =
    process.env.NVIDIA_API_KEY ||
    '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';

  try {
    const body = JSON.parse(event.body || '{}');

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('NVIDIA proxy error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Proxy request failed', details: error.message }),
    };
  }
};
