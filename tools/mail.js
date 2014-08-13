var crypto=require('crypto'),
    async=require('async'),
    nodemailer=require('nodemailer'),
    jade=require('jade');

exports.sendActiveMail=function(email,options,callback){
    var cipher = crypto.createCipher('aes192', 'lxxlxx9179'),
        WEBSITE='http://www.lianyun.me',
        html=jade.renderFile('./views/mail_templates/'+options.template,options.locals);
    href = cipher.update(email, 'utf8', 'hex');
    href += cipher.final('hex');
    href = WEBSITE+'/sign/active?q=' + href;
    var transport = nodemailer.createTransport('SMTP', {
            service: 'QQ',
            auth: {
                user: 'service@sinorvi.com',
                pass: 'lxxlxx9179'
            }
        }),
        mailOptions = {
            from: 'service@sinorvi.com',
            to: email,
            subject: 'hello',
            html: html
        };
    transport.sendMail(mailOptions, function (err) {
        callback(err);
    });
}

exports.sendInviteMail=function(emails,inviter,options,callback){
    var WEBSITE='http://www.lianyun.me',
        html=jade.renderFile('./views/mail_templates/'+options.template,options.locals);
    href = WEBSITE+'/sign/invitee?inviter=' + inviter;
    var transport = nodemailer.createTransport('SMTP', {
            service: 'QQ',
            auth: {
                user: 'service@sinorvi.com',
                pass: 'lxxlxx9179'
            }
        }),
        mailOptions = {
            from: 'service@sinorvi.com',
            to: email,
            subject: 'hello',
            html: html
        };
    //async.each(emails,)
    transport.sendMail(mailOptions, function (err) {
        callback(err);
    });
}
