const express = require('express');
const axios = require('axios');

const app = express();
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Function to fetch emails from MailHog and send them to Discord
async function fetchEmails() {
    try {
        const response = await axios.get('http://mailhog:8025/api/v2/messages');
        const messages = response.data.items;

        for (const message of messages) {
            const from = `${message.From.Mailbox}@${message.From.Domain}`;
            const subject = message.Content.Headers.Subject[0];
            const body = message.Content.Body;

            // Send email content to Discord
            await axios.post(DISCORD_WEBHOOK_URL, {
                content: `📬 **New Mail Received**\n\n**From:** ${from}\n**Subject:** ${subject}\n**Content:**\n${body}`,
            });

            console.log(`Email from ${from} sent to Discord`);

            // Delete the message from MailHog after processing
            await axios.delete(`http://mailhog:8025/api/v1/messages/${message.ID}`);
            console.log(`Email with ID ${message.ID} deleted from MailHog`);
        }
    } catch (error) {
        console.error('Error while processing emails:', error.message);
    }
}

// Fetch emails every 30 seconds
setInterval(fetchEmails, 30000);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
