import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received data:', body);

    // Here you would typically send an email using a service like Resend, SendGrid, or Nodemailer
    // For this example, we'll just log to the console and return a success response.

    return NextResponse.json({ message: 'Data received successfully' });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
