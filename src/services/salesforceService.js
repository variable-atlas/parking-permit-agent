import { SF_CONFIG } from './salesforceConfig'
import { getStoredAuth, logout } from './salesforceAuth'

// Hardcoded resident Contact ID — replace with real Salesforce Contact Id
const RESIDENT_CONTACT_ID = '003gK00000kdbYHQAY'

const query = async (soql) => {
  const auth = getStoredAuth()
  if (!auth) throw new Error('Not authenticated')

  const url = `${auth.instanceUrl}/services/data/${SF_CONFIG.apiVersion}/query?q=${encodeURIComponent(soql)}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (response.status === 401) {
    logout()
    throw new Error('Session expired')
  }

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err[0]?.message || 'Salesforce query failed')
  }

  const data = await response.json()
  return data.records
}

export const fetchParkingPermit = async () => {
  const soql = `
    SELECT
      Id,
      Name,
      Active__c,
      Address__c,
      Paid__c,
      Permit_Start_Date__c,
      Permit_End_Date__c,
      Permit_Value__c
    FROM Parking_Permit__c
    WHERE Resident_Contact__c = '${RESIDENT_CONTACT_ID}'
    LIMIT 1
  `
  const records = await query(soql)
  return records[0] || null
}
