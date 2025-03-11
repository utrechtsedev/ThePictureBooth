// api-F1686E75278B4D2CA02EAC1B820AA638
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525, // 8025, 587 and 25 can also be used.
  auth: {
    user: "thepicturebooth.nl",
    pass: "Wahedbatata23",
  },
});

smtpTransport.sendMail({
  from: "info@thepicturebooth.nl",
  to: "aichou@innovatieweb.nl",
  subject: "Reservering -onvangstbevestiging",
  html: email
},
  function (error, response) {
    if(error){
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
    }
  }
);