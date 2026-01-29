import "dotenv/config";
import express from "express";
import twilio from "twilio";

const app = express();
app.use(express.json());

// Twilio client
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilioAccountSid && twilioAuthToken ? twilio(twilioAccountSid, twilioAuthToken) : null;

// POST /notify - Send SMS notification to patient
app.post("/notify", async (req, res) => {
  const { mobile, tokenNumber, queueName, locationName } = req.body as {
    mobile?: string;
    tokenNumber?: string;
    queueName?: string;
    locationName?: string;
  };

  if (!mobile) {
    res.status(400).json({ message: "mobile is required" });
    return;
  }

  if (!client || !twilioPhoneNumber) {
    res.json({
      message: "Twilio not configured",
      stub: true,
      data: { mobile, tokenNumber, queueName, locationName },
    });
    return;
  }

  try {
    const message = `Your token #${tokenNumber} is ready at ${queueName} (${locationName}). Please proceed to the counter.`;

    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: mobile.startsWith("+") ? mobile : `+${mobile}`,
    });

    res.json({
      message: "SMS sent successfully",
      sid: result.sid,
      tokenNumber,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send SMS",
      error: (error as Error).message,
    });
  }
});

const port = Number(process.env.PORT || 5001);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Notification service listening on ${port}`);
});
