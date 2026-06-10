// Edge function: proxies the Salesforce MIAW SSE stream to the browser
// Uses Edge Runtime for true streaming support

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const url = new URL(req.url)
  const conversationId = url.searchParams.get('conversationId')
  const accessToken = url.searchParams.get('accessToken')

  if (!conversationId || !accessToken) {
    return new Response(JSON.stringify({ error: 'Missing conversationId or accessToken' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const SCRT_URL = process.env.SALESFORCE_SCRT_URL

  const sfRes = await fetch(
    `${SCRT_URL}/iamessage/api/v1/conversation/${conversationId}/stream`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'text/event-stream',
      },
    }
  )

  if (!sfRes.ok) {
    const body = await sfRes.text()
    console.error('Stream error:', sfRes.status, body)
    return new Response(JSON.stringify({ error: `Stream error ${sfRes.status}` }), { status: 500 })
  }

  return new Response(sfRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
