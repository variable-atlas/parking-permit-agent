export const resident = {
  name: 'Rachel Rothwell',
  address: {
    line1: '34 Chester Street',
    line2: '',
    town: 'Hamberly',
    postcode: 'H23 6TY',
  },
  accountNumber: 'RES-2019-0047283',
}

export const binCollections = {
  generalWaste: {
    label: 'General waste (black bin)',
    nextCollection: '2026-06-11',
    frequency: 'Fortnightly',
    dayOfWeek: 'Wednesday',
  },
  recycling: {
    label: 'Recycling (blue bin)',
    nextCollection: '2026-06-18',
    frequency: 'Fortnightly',
    dayOfWeek: 'Wednesday',
  },
  gardenWaste: {
    label: 'Garden waste (green bin)',
    seasonStart: '2026-04-01',
    seasonEnd: '2026-11-28',
    frequency: 'Fortnightly',
    dayOfWeek: 'Wednesday',
    nextCollection: '2026-06-17',
    subscribed: true,
    note: 'Garden waste collections run 1 April to 28 November. A valid subscription sticker must be displayed.',
  },
}

export const parkingPermit = {
  permitNumber: 'BP-2024-47823',
  type: 'Resident Parking Permit',
  zone: 'Zone B – Hamberly Central',
  status: 'active',
  issueDate: '2024-04-01',
  expiryDate: '2027-03-31',
  registeredAddress: '14 Elm Close, Hamberly, BS35 2AB',
  vehicle: {
    make: 'Vauxhall',
    model: 'Astra',
    colour: 'Silver',
    registration: 'GN21 XPT',
  },
}

export const roadworks = [
  {
    id: 'RW-2026-0831',
    promoter: 'Severn Trent Water',
    description: 'Water main replacement — section of Elm Close',
    location: 'Elm Close (between Cedar Road and Oak Avenue junctions)',
    startDate: '2026-06-16',
    endDate: '2026-06-20',
    status: 'upcoming',
    impact: 'Road closed to through traffic. Resident access maintained at all times.',
    contact: 'Severn Trent Water – 0800 783 4444',
  },
]
