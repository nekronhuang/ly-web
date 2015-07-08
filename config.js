var config = {
    website: 'http://www.lianyun.me/',
    port: 9180,
    debug: true,
    maxAge: 3600000 * 24,
    mongo:{
        db: 'mongodb://127.0.0.1/lianyun',
        secret: 'synorme'
    },
    mail:{
        email:'service@sinorvi.com',
        password: 'xxxx'
    },
    crypto:{
        key:'xxxx'
    },
    storage:{
        url:'http://lianyun.qiniudn.com/'
    }
}

module.exports = config;