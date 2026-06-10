// Sends a text message to an existing MIAW conversation

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const SCRT_URL = process.env.SALESFORCE_SCRT_URL
  const { accessToken, conversationId, text } = req.body

  try {
    const msgRes = await fetch(
      `${SCRT_URL}/iamessage/api/v1/conversation/${conversationId}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            id: crypto.randomUUID(),
            messageType: 'StaticContentMessage',
            staticContent: { formatType: 'Text', text },
          },
        }),
      }
    )

    if (!msgRes.ok) {
      const body = await msgRes.text()
      console.error('Send message error:', msgRes.status, body)
      throw new Error(`Send error ${msgRes.status}: ${body}`)
    }

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Message error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
