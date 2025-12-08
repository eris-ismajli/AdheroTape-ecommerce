import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface DealerApplication {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  business_type: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const applicationData: DealerApplication = await req.json();

    // Validate required fields
    if (!applicationData.company_name || !applicationData.contact_name || 
        !applicationData.email || !applicationData.phone || !applicationData.business_type) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Store in database
    const { data, error } = await supabase
      .from('dealer_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send email notification via Resend
    const targetEmail = 'erisismajli7@gmail.com';

    const emailContent = `
New Dealer/Wholesaler Application

Company Name: ${applicationData.company_name}
Contact Name: ${applicationData.contact_name}
Email: ${applicationData.email}
Phone: ${applicationData.phone}
Business Type: ${applicationData.business_type}
Message: ${applicationData.message}

Submitted at: ${new Date().toLocaleString()}
    `;

    const emailHtml = `
<h2>New Dealer/Wholesaler Application</h2>
<p><strong>Company Name:</strong> ${applicationData.company_name}</p>
<p><strong>Contact Name:</strong> ${applicationData.contact_name}</p>
<p><strong>Email:</strong> ${applicationData.email}</p>
<p><strong>Phone:</strong> ${applicationData.phone}</p>
<p><strong>Business Type:</strong> ${applicationData.business_type}</p>
<p><strong>Message:</strong> ${applicationData.message}</p>
<p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
    `;

    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AdheroTape <onboarding@resend.dev>',
          to: [targetEmail],
          subject: 'New Dealer/Wholesaler Application - AdheroTape',
          text: emailContent,
          html: emailHtml,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Failed to send email:', errorText);
      } else {
        const emailResult = await emailResponse.json();
        console.log('Email sent successfully:', emailResult);
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    console.log('Application submitted:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully',
        id: data.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing application:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to submit application',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});