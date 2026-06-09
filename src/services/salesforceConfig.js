export const SF_CONFIG = {
  instanceUrl: import.meta.env.VITE_SF_INSTANCE_URL || 'https://YOUR_DOMAIN.my.salesforce.com',
  clientId: import.meta.env.VITE_SF_CLIENT_ID || 'YOUR_CONSUMER_KEY',
  redirectUri: import.meta.env.VITE_SF_REDIRECT_URI || window.location.origin + '/',
  apiVersion: 'v61.0',
  scopes: 'api openid refresh_token',
}
