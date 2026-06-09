import { SF_CONFIG } from './salesforceConfig'
import { getStoredAuth } from './salesforceAuth'

// Set VITE_SF_AGENT_ID in your .env.local and Vercel env vars
const AGENT_ID = import.meta.env.VITE_SF_AGENT_ID || 'YOUR_AGENT_ID'

let sessionId = null
let sequenceId = 0

export const startSession = async () => {
  const auth = getStoredAuth()
  if (!auth) throw new Error('Not authenticated')

  const response = await fetch(
    `${auth.instanceUrl}/services/data/${SF_CONFIG.apiVersion}/einstein/ai-assist/agents/${AGENT_ID}/sessions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        externalSessionKey: crypto.randomUUID(),
        instanceConfig: { endpoint: auth.instanceUrl },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json().catch(() => [{}])
    throw new Error(err[0]?.message || 'Failed to start Einstein session')
  }

  const data = await response.json()
  sessionId = data.sessionId
  sequenceId = 0
  return sessionId
}

export const sendMessage = async (text) => {
  const auth = getStoredAuth()
  if (!auth) throw new Error('Not authenticated')
  if (!sessionId) await startSession()

  sequenceId += 1

  const response = await fetch(
    `${auth.instanceUrl}/services/data/${SF_CONFIG.apiVersion}/einstein/ai-assist/agents/${AGENT_ID}/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: { sequenceId, type: 'Text', text },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json().catch(() => [{}])
    throw new Error(err[0]?.message || 'Einstein failed to respond')
  }

  const data = await response.json()
  const textMsg = data.messages?.find((m) => m.type === 'Text')
  return textMsg?.text || 'Sorry, I was unable to process that request.'
}

export const endSession = async () => {
  if (!sessionId) return
  const auth = getStoredAuth()
  if (!auth) return
  await fetch(
    `${auth.instanceUrl}/services/data/${SF_CONFIG.apiVersion}/einstein/ai-assist/agents/${AGENT_ID}/sessions/${sessionId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${auth.accessToken}` } }
  )
  sessionId = null
  sequenceId = 0
}
