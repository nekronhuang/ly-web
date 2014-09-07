var config = {
    port: 9180,
    debug: true,
    maxAge: 3600000 * 24,
    mongo:{
        db: 'mongodb://127.0.0.1/lianyun',
        secret: 'synorme'
    },
    mail:{
        email:'service@sinorvi.com',
        password: 'lxxlxx9179'
    },
    crypto:{
        key:'lxxlxx9179'
    }
}

module.exports = config;