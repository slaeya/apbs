export async function onRequestPost(context) {
  try {
    const input = await context.request.formData();
    const name = input.get('name');
    const email = input.get('email');
    const phone = input.get('phone');
    const project = input.get('project');
    const message = input.get('message');

    // Change 'YOUR_RESEND_API_KEY' to the key you got from Resend
    // or better yet, set it as an Environment Variable in Cloudflare
    const resendApiKey = context.env.RESEND_API_KEY;

    const sendEmail = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "APBS Website <website@advancedplasterboardsolutions.co.nz>",
        to: ["your-email@advancedplasterboardsolutions.co.nz"], // Your actual email
        subject: `New Project Enquiry: ${name}`,
        html: `
          <h3>New Website Enquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Project Type:</strong> ${project}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      }),
    });

    if (sendEmail.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/thanks.html" }, // Redirect to a thanks page
      });
    } else {
      return new Response("Error sending email", { status: 500 });
    }
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
