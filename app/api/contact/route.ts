import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, company, message } = await request.json();

    // Validate
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Save to database
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, company, message, status: 'new' }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to save message' }), { status: 500 });
    }

    // Send email to your verified email
    const { error: emailError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'info.ladybugdata@gmail.com',
      subject: subject,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (emailError) {
      console.error('Email Error:', emailError);
      // Don't fail - message is saved in DB
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
