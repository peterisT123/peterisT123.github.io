import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { AdminEmail } from '@/emails/admin-email';
import { AppState } from '@/lib/types';
import * as admin from 'firebase-admin';

function ensureFirebaseAdminInitialized() {
  if (admin.apps.length > 0) {
    return;
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!privateKey || !clientEmail || !projectId) {
      throw new Error("Missing Firebase Admin credentials in environment variables.");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${projectId}.firebaseio.com`
    });
  } catch (error: any) {
    console.error('---!!! FIREBASE ADMIN INITIALIZATION FAILED !!!---', error);
    throw new Error(`Firebase Admin initialization failed: ${error.message}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureFirebaseAdminInitialized();
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const { state }: { state: AppState } = await req.json();

  try {
    const db = admin.firestore();
    const emailHtml = await render(AdminEmail({ state }));

    let subject = `Jauns pieteikums: ${state.product}`;
    if (state.product === 'Īpašums' && state.legalStatus) {
      subject += ` (${state.legalStatus})`;
    }

    const newEmailRef = await db.collection('mail').add({
      to: ['peteris.troksa@inbox.lv', 'inta.troksa@inbox.lv'],
      message: {
        subject: subject,
        html: emailHtml,
      },
    });

    console.log('SUCCESS: Email document created in Firestore with ID:', newEmailRef.id);
    return NextResponse.json({ message: 'Email document created successfully in Firestore.' });

  } catch (error: any) {
    console.error('---!!! FIRESTORE WRITE FAILED !!!---');
    const errorMessage = error.message || JSON.stringify(error);
    console.error('ERROR DETAILS:', errorMessage);
    return NextResponse.json({ error: `Failed to send email: ${errorMessage}` }, { status: 500 });
  }
}
