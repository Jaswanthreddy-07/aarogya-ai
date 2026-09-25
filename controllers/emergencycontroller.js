const EmergencyContact = require("../AI models/emergencycontact");
const EmergencyEvent = require("../AI models/emergencyevent");

// Add emergency contact
exports.addContact = async (req, res) => {
  try {
    const {
      name,
      phone,
      relation
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Contact name and phone are required" });
    }

    const normalizedPhone = phone.trim();
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      return res.status(400).json({
        message: "Use Indian international format, for example +919876543210"
      });
    }

    const contact = await EmergencyContact.create({
      user: req.user.id,
      name,
      phone: normalizedPhone,
      relation
    });

    res.status(201).json({
      message: "Emergency contact added",
      contact
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add emergency contact",
      error: error.message
    });
  }
};


// Get emergency contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      user: req.user.id
    });

    res.json(contacts);

  } catch (error) {
    res.status(500).json({
      message: "Failed to get emergency contacts",
      error: error.message
    });
  }
};


// Delete emergency contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    res.json({
      message: "Emergency contact deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete contact",
      error: error.message
    });
  }
};


// SOS event
exports.sendSOS = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ user: req.user.id });
    if (!contacts.length) {
      return res.status(400).json({ message: "Add an emergency contact before sending an alert" });
    }

    const recipients = contacts.map(contact => contact.phone);
    const event = await EmergencyEvent.create({
      user: req.user.id,
      recipients,
      message: "Emergency alert started from Arogya AI. Please contact the user immediately."
    });

    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
      event.status = "failed";
      event.message = "Emergency event saved, but SMS delivery is not configured";
      await event.save();
      return res.status(503).json({
        message: "Emergency event saved, but SMS delivery is not configured. Add Twilio settings to .env.",
        status: event.status,
        eventId: event._id
      });
    }

    const body = new URLSearchParams({
      From: TWILIO_FROM_NUMBER,
      Body: event.message
    });
    const deliveryResults = [];
    for (const phone of recipients) {
      body.set("To", phone);
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body
        }
      );
      const result = await response.json();
      deliveryResults.push({
        phone,
        status: response.ok ? "sent" : "failed",
        error: response.ok ? undefined : result.message || "Twilio rejected the message"
      });
    }

    event.deliveryResults = deliveryResults;
    event.status = deliveryResults.some(result => result.status === "sent") ? "completed" : "failed";
    await event.save();

    res.json({
      message: event.status === "completed"
        ? "Emergency alert sent to your saved contacts"
        : "Emergency alert could not be delivered",
      status: event.status,
      eventId: event._id,
      deliveryResults
    });

  } catch (error) {
    res.status(500).json({
      message: "SOS failed",
      error: error.message
    });
  }
};