// src/routes/debug/+server.js
export function GET({ request }) {
  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key] = value;
  }

  return new Response(JSON.stringify({
    headers,
    ip: {
      cf: request.headers.get('cf-connecting-ip'),
      xForwarded: request.headers.get('x-forwarded-for'),
      xReal: request.headers.get('x-real-ip')
    }
  }, null, 2), {
    headers: {
      'content-type': 'application/json'
    }
  });
}
