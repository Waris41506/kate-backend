// // server.js
// const express = require("express");
// const nodemailer = require("nodemailer");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// // Allow requests from your frontend
// app.use(cors({ origin: "*" })); 
// app.use(express.json());

// // -----------------------------
// // POST /send-code
// // -----------------------------
// app.post("/send-code", async (req, res) => {
//   const code = Math.floor(1000 + Math.random() * 9000);

//   const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
//   const ADMIN_EMAIL_PASS = process.env.ADMIN_EMAIL_PASS;

//   if (!ADMIN_EMAIL || !ADMIN_EMAIL_PASS) {
//     return res.status(500).json({ error: "Email credentials not set in environment" });
//   }

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: ADMIN_EMAIL,
//       pass: ADMIN_EMAIL_PASS,
//     },
//   });

//   try {
//     await transporter.sendMail({
//       from: ADMIN_EMAIL,
//       to: ADMIN_EMAIL, // send code to yourself
//       subject: "Login Code Requested",
//       text: `Login code: ${code}`,
//     });

//     res.status(200).json({ code });
//   } catch (error) {
//     console.error("Mail Error:", error);
//     res.status(500).json({ error: "Failed to send email" });
//   }
// });

// // -----------------------------
// // START SERVER
// // -----------------------------
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// SendGrid Setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// -----------------------------
// POST /send-code
// -----------------------------
if (!process.env.SENDGRID_API_KEY || !process.env.ADMIN_EMAIL) {
  console.error("Missing environment variables");
}

app.post("/send-code", async (req, res) => {
  const code = Math.floor(1000 + Math.random() * 9000);

  if (!process.env.ADMIN_EMAIL) {
  return res.status(500).json({ error: "Email config error" });
}

  const msg = {
    to: process.env.ADMIN_EMAIL,   // recipient
    from: "yusuffwaris8@gmail.com", // must match verified sender
    subject: "Login Code Requested",
    text: `Login code: ${code}`,
  };

  try {
    await sgMail.send(msg);
    res.json({ code });
  } catch (err) {
    console.error("SendGrid Error:", err.response?.body || err.message);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
});

// -----------------------------
// START SERVER
// -----------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

