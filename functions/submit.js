export async function onRequestPost(context) {
  try {
    const input = await context.request.formData();
    const data = {
      name: input.get('name'),
      email: input.get('email'),
      phone: input.get('phone'),
      message: input.get('message'),
    };

    const resendApiKey = context.env.RESEND_API_KEY;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Website <enquiry@advancedplasterboardsolutions.co.nz>",
        to: ["hieu@advancedplasterboardsolutions.co.nz"], // Change this!
        subject: `New Lead: ${data.name}`,
        html: `<p><strong>Name:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Phone:</strong> ${data.phone}</p><p><strong>Message:</strong> ${data.message}</p>`,
      }),
    });

    if (response.ok) {
      return new Response(null, { status: 302, headers: { Location: "/thanks.html" } });
    }
    return new Response("Error", { status: 500 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
