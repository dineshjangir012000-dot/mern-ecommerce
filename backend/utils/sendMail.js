import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

 const sendMail = async (to, subject, htmlContent) => {
    try {
        const mailOption = { 
            from : `"your app name is " ${process.env.EMAIL_USER}`,
            to,
            subject,
            html: htmlContent
        }
        const info = await transporter.sendMail(mailOption)
        console.log("Mail sent", info);

        return true;
    } catch (error) {
        console.log("Error in sending mail", error)
        return false;
    }
}

export default sendMail;