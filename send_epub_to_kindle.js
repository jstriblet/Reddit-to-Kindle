import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

// Define your GMX email credentials
const gmxEmail = '[your_gmx_email]@gmx.com';
const gmxPassword = '[your_gmx_password]';

// Define the recipient email address (your Kindle email address)
const kindleEmail = '[your_kindle_email]@kindle.com';

// Define the path to the EPUB file
const epubFilePath = path.join(process.cwd(), 'reddit_feed.epub');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: gmxEmail,
        pass: gmxPassword,
    },
});

// Read the EPUB file
try {
    const data = await fs.readFile(epubFilePath);

    // Send mail with defined transport object
    const mailOptions = {
        from: gmxEmail,
        to: kindleEmail,
        subject: 'Your Reddit Feed',
        text: 'Attached is the latest Reddit feed in EPUB format.',
        attachments: [
            {
                filename: 'reddit_feed.epub',
                content: data,
                contentType: 'application/epub+zip',
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return;
        }
        console.log('Email sent:', info.response);
    });
} catch (err) {
    console.error('Error reading EPUB file:', err);
}