import { SF_CONFIG } from './salesforceConfig'

const VERIFIER_KEY = 'sf_pkce_verifier'
const TOKEN_KEY = 'sf_access_token'
const INSTANCE_KEY = 'sf_instance_url'

// PKCE helpers

const generateVerifier = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const generateChallenge = async (verifier) => {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Redirect user to Salesforce login
export const initiateLogin = async () => {
  const verifier = generateVerifier()
  const challenge = await generateChallenge(verifier)
  sessionStorage.setItem(VERIFIER_KEY, verifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SF_CONFIG.clientId,
    redirect_uri: SF_CONFIG.redirectUri,
    scope: SF_CONFIG.scopes,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })

  window.location.href = `${SF_CONFIG.instanceUrl}/services/oauth2/authorize?${params}`
}

// Exchange auth code for access token (called after redirect back)
export const handleCallback = async (code) => {
  const verifier = sessionStorage.getItem(VERIFIER_KEY)
  if (!verifier) throw new Error('No PKCE verifier found — restart the login flow')

  const response = await fetch(`${SF_CONFIG.instanceUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: SF_CONFIG.clientId,
      redirect_uri: SF_CONFIG.redirectUri,
      code,
      code_verifier: verifier,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error_description || 'Token exchange failed')
  }

  const data = await response.json()
  localStorage.setItem(TOKEN_KEY, data.access_token)
  localStorage.setItem(INSTANCE_KEY, data.instance_url)
  sessionStorage.removeItem(VERIFIER_KEY)

  return { accessToken: data.access_token, instanceUrl: data.instance_url }
}

export const getStoredAuth = () => {
  const accessToken = localStorage.getItem(TOKEN_KEY)
  const instanceUrl = localStorage.getItem(INSTANCE_KEY)
  return accessToken && instanceUrl ? { accessToken, instanceUrl } : null
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(INSTANCE_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)
}
