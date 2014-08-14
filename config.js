var config = {
    port: 9180,
    debug: true,
    maxAge: 3600000 * 24,
    mongo:{
        db: 'mongodb://127.0.0.1/lianyun',
        secret: 'synorme'
    },
    mail:{
        email:'service@example.com',
        password: 'password'
    },
    crypto:{
        key:'secretKey'
    }
}

module.exports = config;