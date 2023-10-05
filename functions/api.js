const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000; // Set your desired port number

// Replace with your OpenAI API key
const apiKey = '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';

app.use(express.json());

const prompt = "Gere frases inspiradoras inspiradas no estoicismo em português," + 
"com uma probabilidade de alto alcance (80%-90%) nas redes sociais. Cada frase deve refletir os princípios estoicos de sabedoria, "+
"resiliência e força interior. Após gerar as frases, mostre as estatísticas de desempenho, incluindo o alcance, engajamento, feedback dos usuários e hashtags."

app.get('/generate-inspirational-quotes', async (req, res) => {
  try {
    const { emails } = req.body;

    // Send a request to OpenAI API
    const response = await axios.post('https://api.openai.com/v1/completions', {
      prompt,
      max_tokens: 256, // Adjust as needed
      temperature: 0.9, // Adjust as needed
      model: 'text-davinci-003',
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const generatedText = response.data.choices[0].text;

    for (const email of emails) {
      // Call the sendEmailToUser function with the matching email address
      await sendEmailToUser(email, generatedText); // Replace generatedText with the actual text you want to send
    }

    console.log('Response sent to the user emails:', generatedText);

    res.status(200).json({ message: 'Quotes generated and emails sent successfully', content: generatedText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Function to send an email to the user
async function sendEmailToUser(userEmail, content) {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "joseazevedojsm@gmail.com",
        pass: "bILUnJ3CAgTGH4tk"
      }
    });

    // Email content
    const mailOptions = {
      from: 'audioteca@gmail.com',
      to: userEmail,
      subject: 'AudioTeca AI Assistant',
      text: content, // The generated text you want to send
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports.handler = serverless(app);
