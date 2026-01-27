import { AdminEmail } from '@/emails/admin-email';
import { AppState } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { state }: { state: AppState } = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'Pieteikums <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `Jauns pieteikums: ${state.product}`,
      react: AdminEmail({ state }),
    });

    if (error) {
      console.error({ error });
      return NextResponse.json({ error });
    }

    console.log({ data });
    return NextResponse.json({ data });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ error });
  }
}
