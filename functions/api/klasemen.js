// Cloudflare Pages Function
// Endpoint: /api/klasemen
// GET  -> ambil data klasemen tersimpan
// POST -> simpan data klasemen baru
//
// Butuh KV Namespace bernama "KLASEMEN_KV" di-bind ke project Pages ini.
// Caranya: Cloudflare Dashboard -> Workers & Pages -> (project ini) -> Settings
// -> Functions -> KV namespace bindings -> tambahkan binding "KLASEMEN_KV"

const KEY = 'klasemen-data';

export async function onRequestGet(context) {
  const { env } = context;
  const stored = await env.KLASEMEN_KV.get(KEY);
  return new Response(
    JSON.stringify({ value: stored ? JSON.parse(stored) : null }),
    { headers: { 'content-type': 'application/json' } }
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.text();
    // validasi sederhana: pastikan ini JSON yang valid sebelum disimpan
    JSON.parse(body);
    await env.KLASEMEN_KV.put(KEY, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Data tidak valid' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
}
