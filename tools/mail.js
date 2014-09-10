var crypto=require('crypto'),
    async=require('async'),
    nodemailer=require('nodemailer'),
    jade=require('jade'),
    config=require('../config');

exports.sendActiveMail=function(email,options,callback){
    var cipher = crypto.createCipher('aes192', config.crypto.key),
        WEBSITE='http://www.lianyun.me',
        html=jade.renderFile('./views/mail_templates/'+options.template,options.locals);
    href = cipher.update(email, 'utf8', 'hex');
    href += cipher.final('hex');
    href = WEBSITE+'/sign/active?q=' + href;
    var transport = nodemailer.createTransport({
            service: 'QQ',
            auth: {
                user: config.mail.email,
                pass: config.mail.password
            }
        }),
        mailOptions = {
            from: config.mail.email,
            to: email,
            subject: 'hello',
            html: html
        };
    transport.sendMail(mailOptions, function (err) {
        callback(err);
    });
}

exports.sendMail=function(email,options,callback){
    var html=jade.renderFile('./views/mail_templates/'+options.template,options.locals),
        transport = nodemailer.createTransport({
            service: 'QQ',
            auth: {
                user: config.mail.email,
                pass: config.mail.password
            }
        }),
        mailOptions = {
            from: config.mail.email,
            to: email,
            subject: options.subject,
            html: html
        };
    transport.sendMail(mailOptions, function (err,info) {
        callback(err,info);
    });
}
