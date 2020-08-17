// email for sign up or deleting account
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "figliuologiuseppe@hotmail.com",
    subject: "Grazie per l'iscrizione",
    text: `Grazie ${name} per esserti iscritto alla nostra newsletter.`,
  });
};

module.export = {
  sendWelcomeEmail,
};
