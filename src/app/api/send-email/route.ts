
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
  });
}

const db = admin.firestore();

const createHtmlBody = (state: any): string => {
    const { legalStatus, contact, buildings } = state;

    let html = `<h1>Jauns apdrošināšanas pieteikums</h1>`;
    html += `<h2>Klienta informācija</h2>`;
    html += `<p><strong>Personas statuss:</strong> ${formatValue(legalStatus)}</p>`;
    html += `<p><strong>Vārds, Uzvārds:</strong> ${formatValue(contact.name)}</p>`;
    html += `<p><strong>E-pasts:</strong> ${formatValue(contact.email)}</p>`;
    html += `<p><strong>Tālrunis:</strong> ${formatValue(contact.phone)}</p>`;

    html += `<h2>Apdrošināmie objekti</h2>`;

    buildings.forEach((building: any, index: number) => {
        html += `<hr>`;
        html += `<h3>Objekts #${index + 1}</h3>`;
        html += `<p><strong>Tips:</strong> ${formatValue(building.objectType)}</p>`;
        html += `<p><strong>Īpašnieks:</strong> ${formatValue(building.ownerName)}</p>`;
        html += `<p><strong>Platība:</strong> ${formatValue(building.propertyArea)} m²</p>`;
        html += `<p><strong>Būvniecības materiāls:</strong> ${formatValue(building.constructionMaterial)}</p>`;
        html += `<p><strong>Ekspluatācijā nodošanas gads:</strong> ${formatValue(building.commissioningYear)}</p>`;
        html += `<p><strong>Pēdējais remonta gads:</strong> ${formatValue(building.lastRenovationYear)}</p>`;
        html += `<p><strong>Apdares līmenis:</strong> ${formatValue(building.finishingLevel)}</p>`;

        if (building.objectType === 'Dzīvoklis' || building.objectType === 'Ēka') {
            html += `<p><strong>Stāvs:</strong> ${formatValue(building.currentFloor)}</p>`;
            html += `<p><strong>Kopējais stāvu skaits:</strong> ${formatValue(building.totalFloors)}</p>`;
        }

        html += `<p><strong>Pastāvīgi apdzīvots:</strong> ${formatBoolean(building.isConstantlyInhabited)}</p>`;
        html += `<p><strong>Zaudējumi pēdējos 3 gados:</strong> ${formatBoolean(building.lossesInLast3Years)}</p>`;
        html += `<p><strong>Tiek izīrēts:</strong> ${formatBoolean(building.isRented)}</p>`;
        html += `<p><strong>Ir signalizācija:</strong> ${formatBoolean(building.hasSecurityAlarm)}</p>`;

        if (legalStatus === 'Juridiska persona') {
            html += `<p><strong>Notiek komercdarbība:</strong> ${formatBoolean(building.isCommercial)}</p>`;
            if (building.isCommercial) {
                html += `<p><strong>Komercdarbības veids:</strong> ${formatValue(building.commercialActivityType)}</p>`;
            }
        }
        
        html += `<h4>Saules paneļi</h4>`;
        html += `<p><strong>Ir uzstādīti:</strong> ${formatBoolean(building.hasSolarPanels)}</p>`;
        if (building.hasSolarPanels) {
            html += `<p><strong>Skaits:</strong> ${formatValue(building.solarPanelsCount)}</p>`;
            html += `<p><strong>Vērtība:</strong> ${formatValue(building.solarPanelsValue)} EUR</p>`;
            html += `<p><strong>Atrašanās vieta:</strong> ${formatValue(building.solarPanelsLocation)}</p>`;
        }

        html += `<h4>Kustamā manta</h4>`;
        html += `<p><strong>Iekļauta:</strong> ${formatBoolean(building.movablePropertyIncluded)}</p>`;
        if (building.movablePropertyIncluded) {
            html += `<p><strong>Vērtīga (virs 3000 EUR):</strong> ${formatBoolean(building.valuableMovablePropertyIncluded)}</p>`;
        }

        html += `<h4>Civiltiesiskā atbildība</h4>`;
        html += `<p><strong>Iekļauta:</strong> ${formatBoolean(building.civilLiabilityInsuranceIncluded)}</p>`;
        if (building.civilLiabilityInsuranceIncluded) {
            html += `<p><strong>Segums:</strong> ${formatValue(building.civilLiabilityCoverage)}</p>`;
        }
    });

    return html;
}
const formatBoolean = (value: boolean) => (value ? 'Jā' : 'Nē');
const formatValue = (value: string | number | undefined, defaultValue: string = 'Nav norādīts') => value ?? defaultValue;

export async function POST(req: NextRequest) {
  try {
    const state = await req.json();
    const { contact } = state;
    const htmlBody = createHtmlBody(state);

    // Create a new document in the 'mail' collection
    await db.collection('mail').add({
      to: [contact.email],
      bcc: ['intasapdrosin@my.domainp.com', 'peteris.troksa@inbox.lv'],
      message: {
        subject: `Jauns apdrošināšanas pieteikums no ${contact.name}`,
        html: htmlBody,
      },
    });

    return NextResponse.json({ message: 'Pieteikums nosūtīts!' }, { status: 200 });

  } catch (error) {
    console.error('API kļūda (send-email):', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: `Kļūda sūtot e-pastu: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'Nezināma kļūda sūtot e-pastu.' }, { status: 500 });
  }
}
