import { useEffect } from 'react'

export default function SalesforceChat() {
  useEffect(() => {
    if (document.getElementById('sf-miaw-bootstrap')) return

    const script = document.createElement('script')
    script.id = 'sf-miaw-bootstrap'
    script.type = 'text/javascript'
    script.src = 'https://orgfarm-85890e091f-dev-ed.develop.my.site.com/ESWHamberly1781081813742/assets/js/bootstrap.min.js'
    script.onload = () => {
      try {
        embeddedservice_bootstrap.settings.language = 'en_US'
        embeddedservice_bootstrap.init(
          '00DgK00000QBFKv',
          'Hamberly',
          'https://orgfarm-85890e091f-dev-ed.develop.my.site.com/ESWHamberly1781081813742',
          {
            scrt2URL: 'https://orgfarm-85890e091f-dev-ed.develop.my.salesforce-scrt.com',
          }
        )
      } catch (err) {
        console.error('Error loading Salesforce Embedded Messaging:', err)
      }
    }
    document.body.appendChild(script)
  }, [])

  return null
}
