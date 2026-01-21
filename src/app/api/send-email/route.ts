
import {NextResponse} from 'next/server';
import nodemailer from 'nodemailer';
import {type AppState} from '@/lib/types';

// Helper function to generate HTML for a summary item
const summaryItem = (label: string, value: string | number | undefined) => {
    if (!value) return '';
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${label}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${value}</td>
      </tr>
    `;
};

// Helper function to generate HTML for a boolean summary item
const booleanSummaryItem = (label: string, value: boolean) => {
  return `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${label}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">
        ${value ? '✔️ Jā' : '❌ Nē'}
      </td>
    </tr>
  `;
};

const generateHtml = (state: AppState) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
            <h1 style="color: #333; text-align: center;">Jauns apdrošināšanas pieteikums</h1>
            
            <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">Klienta informācija</h2>
            <table style="width: 100%; border-collapse: collapse;">
                ${summaryItem('Personas statuss', state.legalStatus)}
                ${summaryItem('Vārds, uzvārds', state.contact.name)}
                ${summaryItem('E-pasts', state.contact.email)}
                ${summaryItem('Tālrunis', state.contact.phone)}
            </table>

            <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; margin-top: 30px;">Apdrošināmie objekti</h2>
            ${state.buildings.map((building, index) => `
                <div style="border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
                    <h3 style="background-color: #f7f7f7; padding: 10px; margin: 0; color: #333;">Nr.${index + 1} - ${building.objectType}</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${summaryItem('Īpašnieks', building.ownerName)}
                        ${summaryItem('Platība', `${building.propertyArea} m²`)}
                        ${summaryItem('Būvniecības gads', building.buildYear)}
                        ${building.objectType === 'Dzīvoklis' ? `
                            ${summaryItem('Stāvs', building.currentFloor)}
                            ${summaryItem('Kopējais stāvu skaits', building.totalFloors)}
                        ` : ''}
                        ${building.objectType === 'Māja' ? `
                            ${summaryItem('Stāvu skaits', building.totalFloors)}
                        ` : ''}
                        ${booleanSummaryItem('Pastāvīgi apdzīvots', building.isConstantlyInhabited)}
                        ${booleanSummaryItem('Zaudējumi pēdējos 3 gados', building.lossesInLast3Years)}
                        ${booleanSummaryItem('Kustamā manta', building.movablePropertyIncluded)}
                        ${building.movablePropertyIncluded ? `
                            <tr>
                                <td colspan="2">
                                    <div style="padding-left: 20px;">
                                        <table style="width: 100%; border-collapse: collapse;">
                                            ${booleanSummaryItem('Vērtīga kustamā manta', building.valuableMovablePropertyIncluded)}
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        ` : ''}
                    </table>
                </div>
            `).join('')}
        </div>
    `;
};


export async function POST(req: Request) {
  const state: AppState = await req.json();
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_PASS = process.env.GMAIL_PASS;
  const BROKER_EMAIL = process.env.BROKER_EMAIL;

  if (!GMAIL_USER || !GMAIL_PASS || !BROKER_EMAIL) {
    return NextResponse.json({ message: 'Gmail credentials not configured in environment variables.' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const htmlBody = generateHtml(state);

  const mailOptionsBroker = {
    from: GMAIL_USER,
    to: BROKER_EMAIL,
    subject: 'Jauns apdrošināšanas pieteikums',
    html: htmlBody,
  };

  const mailOptionsClient = {
    from: GMAIL_USER,
    to: state.contact.email,
    subject: 'Jūsu apdrošināšanas pieteikums ir saņemts',
    html: `<p>Paldies par Jūsu pieteikumu! Mēs ar Jums sazināsimies tuvākajā laikā.</p>${htmlBody}`,
  };

  try {
    await transporter.sendMail(mailOptionsBroker);
    await transporter.sendMail(mailOptionsClient);
    return NextResponse.json({ message: 'Email sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
}
