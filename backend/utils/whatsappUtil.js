import axios from "axios";

export const sendWhatsAppOTPMessage = async (phone, otp) => {
  const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: `91${phone}`,
    type: "template",
    template: {
      name: "otp_login",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: "Local Service App" },
            { type: "text", text: otp },
            { type: "text", text: "5" }
          ]
        }
      ]
    }
  };

  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
};
