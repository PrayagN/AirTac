export function GET() {
  const content = "google.com, pub-5544821471604950, DIRECT, f00c287a34f156ce\n";
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
