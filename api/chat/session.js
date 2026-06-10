// Creates a MIAW access token and conversation session
// Returns { accessToken, conversationId } to the client

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const SCRT_URL = process.env.SALESFORCE_SCRT_URL
  const ORG_ID = process.env.SALESFORCE_ORG_ID
  const DEV_NAME = process.env.SALESFORCE_DEVELOPER_NAME

  try {
    // Step 1: Get unauthenticated access token from MIAW
    const tokenRes = await fetch(
      `${SCRT_URL}/iamessage/api/v1/authorization/unauthenticated/access-token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: ORG_ID,
          developerName: DEV_NAME,
          capabilitiesVersion: '1',
          platform: 'Web',
        }),
      }
    )

    if (!tokenRes.ok) {
      const body = await tokenRes.text()
      console.error('Token error:', tokenRes.status, body)
      throw new Error(`Token error ${tokenRes.status}: ${body}`)
    }

    const { accessToken } = await tokenRes.json()

    // Step 2: Create a conversation
    const conversationId = crypto.randomUUID()

    const convRes = await fetch(
      `${SCRT_URL}/iamessage/api/v1/conversation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          orgId: ORG_ID,
          developerName: DEV_NAME,
          conversationId,
          esDeveloperName: DEV_NAME,
        }),
      }
    )

    if (!convRes.ok) {
      const body = await convRes.text()
      console.error('Conversation error:', convRes.status, body)
      throw new Error(`Conversation error ${convRes.status}: ${body}`)
    }

    res.status(200).json({ accessToken, conversationId })
  } catch (err) {
    console.error('Session error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
