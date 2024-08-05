const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json());

let emailData = [];
let pdf = null;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure Nodemailer to use Outlook with your email
const mailSender = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com', // Outlook SMTP server
  port: 587, // SMTP port for TLS
  secure: false, // Use TLS
  auth: {
    user: 'hr@epicademy.org', // Your Outlook email address
    pass: 'Epic@2024', // Your Outlook email password
  },
  tls: {
    ciphers: 'SSLv3' // Required for Outlook
  }
});

const sendmymails = async (name, sub, content, email) => {
  console.log("Sending mail started");

  const sendOtpEmail = async (mailBody) => {
    const info = await mailSender.sendMail({
      from: '"Epicademy" <hr@epicademy.org>',
      to: email,
      subject: sub,
      html: mailBody,
      // attachments: [
      //   {
      //     filename: "News_Letter.pdf",
      //     disposition: "attachment",
      //     content: pdf,
      //   },
      // ],
    });
    console.log("News Letter sent", info.response);
  };

  const mailBody = `
    <div>
      <p>Dear ${name},</p>
      <p>${content}</p>
      <p>We request that you take a xerox copy of your PAN card, sign it, and then convert the signed copy into a PDF. Please upload this PDF to the Google form linked below. Make sure all details are filled out correctly and the file is uploaded properly.</p>
      
      <p><strong>Note:</strong> This step is necessary for crediting your internship stipend.</p>
      
      <p>Google Form Link:<a href="https://forms.gle/hjG39JvJMx1rnPwWA" target="_blank">(https://forms.gle/hjG39JvJMx1rnPwWA)</a></p>
      
      <p>Thank you for your cooperation.</p>
    </div>
  `;


  await sendOtpEmail(mailBody);
  console.log("Mail sent guru");
};

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log(jsonData);
    emailData = jsonData;
    console.log("The salary data is", emailData);
    res.send(jsonData);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file.');
  }
});

app.post('/pdfup', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    pdf = req.file.buffer; // Read the file buffer
    console.log("pdf", pdf);
    res.send('PDF uploaded successfully');
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file.');
  }
});

app.post('/send', async (req, res) => {
  const { sub, content } = req.body;
  console.log(req.body);
  
  for (let i = 0; i < emailData.length; i++) {
    console.log(emailData[i].Name);
    console.log(emailData[i].Email);
    await sendmymails(emailData[i].Name, sub, content, emailData[i].Email);
    console.log("mail sent to ", emailData[i].Name);
  }
  res.send("Mail Sent");
});

app.listen(5000, () => {
  console.log("Server is running..!!!");
});
