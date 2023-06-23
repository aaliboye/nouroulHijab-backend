const nodemailer = require('nodemailer');


module.exports = {

    sendMail : (message, receiverMail, senderMail,res) =>{
        var config = {
            service: 'gmail',
            secure: false,
            auth: {
              user: senderMail,
              pass: 'yrlmapkfqryzslba'
            }
        }
        
        var options = {
            from: senderMail,
            to: receiverMail,
            subject: 'lien de connection from Nouroul hijab',
            text: `${message}`
        }

        var transporter = nodemailer.createTransport(config);
  
        transporter.sendMail(options, function(error, info){
            if (error) {
            console.log(error);
            return res.json({success: false, message: "mail non envoyé"})

            } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({success: true, message: "mail envoyé"})

            }
        });


    }
}



