import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  throw new Error("RESEND_API_KEY environment variable is required");
}

const resend = new Resend(resendApiKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const adminEmails = [
      "vipbishnoi47@gmail.com",
      "vickymaanzu@gmail.com",
    ];

    const emailResults = await Promise.all(
      adminEmails.map(async (adminEmail) => {
        try {
          const emailResponse = await resend.emails.send({
            from: "Siddhi Vinayak Steel <onboarding@resend.dev>",
            to: [adminEmail],
            subject: `New Contact Form - Siddhi Vinayak Steel: ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong> ${message}</p>
            `,
          });

          console.log(`Email sent successfully to ${adminEmail}:`, emailResponse);
          return { email: adminEmail, success: true };
        } catch (emailError) {
          console.error(`Failed to send email to ${adminEmail}:`, emailError);
          return { email: adminEmail, success: false };
        }
      })
    );

    const atLeastOneEmailSent = emailResults.some((result) => result.success);

    if (!atLeastOneEmailSent) {
      return new Response(
        JSON.stringify({ error: "Failed to send emails to all recipients" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message received and sent successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process contact form submission" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
