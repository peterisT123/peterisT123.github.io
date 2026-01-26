
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AdminEmail } from '@/emails/admin-email';
import { AppState } from '@/lib/types';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export async function POST(req: NextRequest) {
  const { state }: { state: AppState } = await req.json();

  try {
    // Send email to admin
    if (adminEmail) {
      console.log(`Attempting to send email to admin: ${adminEmail}`);
      const { data, error } = await resend.emails.send({
        from: 'Pieteikums <onboarding@resend.dev>',
        to: [adminEmail],
        subject: `Jauns pieteikums: ${state.product}`,
        react: AdminEmail({ state }),
      });

      if (error) {
        console.error('Error from Resend API:', error);
        return NextResponse.json({ error }, { status: 500 });
      }

      console.log('Email sent successfully, Resend ID:', data?.id);
    } else {
      console.warn('Admin email not configured. Cannot send email.');
    }

    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error in POST /api/send:', error);
    return NextResponse.json({ error: 'Error sending emails' }, { status: 500 });
  }
}
