import dayjs from "dayjs";
import {emailTemplates} from "./email.template.js";
import { SENDER_EMAIL} from "../config/env.js";
import {transporter} from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription}) => {
    if(!to || !type) throw new Error("Missing required parameters");

    const template = emailTemplates.find((template) => template.label === type);

    if(!template) throw  new Error("invalid email type");

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format("MMM Do, YYYY"),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo)
    const subject = template.generateSubject(mailInfo)

    const mailOptions = {
        form: SENDER_EMAIL,
        to: to,
        subject: subject,
        html: message,
    }

    await transporter.sendMail(mailOptions, (error, info)=> {
        if(error) return console.log(error, "Error sending email");

        console.log("Email sent: " + info.response);
    })
}