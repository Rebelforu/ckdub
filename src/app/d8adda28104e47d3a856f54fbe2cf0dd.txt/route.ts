export const dynamic = 'force-static';

export async function GET() {
  return new Response('d8adda28104e47d3a856f54fbe2cf0dd', {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
