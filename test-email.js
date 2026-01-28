const testData = {
  state: {
    step: 1,
    product: 'Īpašums',
    legalStatus: 'Fiziska persona',
    buildings: [
      {
        id: '1',
        objectType: 'Ēka',
        ownerName: 'Jānis Bērziņš',
        propertyArea: 150,
        commissioningYear: 'Pēc 2000',
        constructionMaterial: 'Mūris',
        finishingLevel: 'Kvalitatīvs',
        isConstantlyInhabited: true,
        isRented: false,
        hasSecurityAlarm: true,
        lossesInLast3Years: false,
        movablePropertyIncluded: true,
        totalMovablePropertyValue: 10000,
        valuableMovablePropertyIncluded: false,
        hasSolarPanels: false,
        isCommercial: false,
        civilLiabilityInsuranceIncluded: true,
        civilLiabilityCoverage: 'Visā Latvijā',
        civilLiabilityValue: '10000',
        totalFloors: 2,
      },
    ],
    travel: {
      destination: '',
      departureDate: null,
      returnDate: null,
      travelers: {
        upTo64: 0,
        from65to74: 0,
        from75: 0,
      },
      tripCancellation: false,
      tripCancellationValue: 0,
      luggageInsurance: false,
      luggageInsuranceValue: 0,
      personalAccidentInsurance: false,
      personalAccidentInsuranceValue: 0,
      civilLiability: false,
      civilLiabilityValue: 0,
      legalAssistance: false,
      legalAssistanceValue: 0,
      sportsEquipment: false,
      sportsEquipmentValue: 0,
    },
    contact: {
      name: 'Jānis Bērziņš',
      email: 'janis.berzins@example.com',
      phone: '+37129505520',
      company: '',
      consent: true,
    },
    submitted: false,
  },
};

import('node-fetch').then(fetch => {
  fetch.default('http://localhost:3000/api/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData),
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
});
