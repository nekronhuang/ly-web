var contacts = require('./controllers/contacts'),
    sign = require('./controllers/sign'),
    render = require('./controllers/render'),
    rest = require('./controllers/rest'),
    settings = require('./controllers/settings'),
    filter = require('./tools/filter');

module.exports = function (app) {
    app.get('/', function (req, res) {
        console.log(req.session.user)
        if(req.session.user){
            res.redirect('/contacts');
        }else{
            res.render('index');
        }
    });

    app.get('/data/users/info/self',filter.authorize,rest.getUserInfo);
    app.put('/data/users/changePwd/self',filter.authorize,rest.changePwd);
    app.post('/data/users/newgroup/self',filter.authorize,rest.pushNewGroup);
    app.get('/data/users/group/:oid',filter.authorize,rest.getUsersByGroup);
    app.put('/data/users/edit/self',filter.authorize,rest.editUser);

    app.get('/data/contacts/group/:oid',filter.authorize,rest.getContactsByGroup);
    app.get('/data/contacts/tag/:name',filter.authorize,rest.getContactsByTag);
    app.put('/data/contacts/edit/:oid',filter.authorize,rest.editContact);
    app.put('/data/contacts/multiedit/:oids',filter.authorize,rest.editContacts);
    app.delete('/data/contacts/group/:groupId',filter.authorize,rest.deleteGroup);

    app.post('/data/notes/insert',filter.authorize,rest.insertNewNote);

    app.get('/app/contacts',filter.authorize,contacts.showContacts);
    app.get('/app/contacts/detail',filter.authorize,contacts.showDetail);
    app.get('/app/contacts/upload', filter.authorize, contacts.showUpload);
    app.get('/app/contacts/add', filter.authorize, contacts.showAdd);
    app.post('/app/contacts/add', filter.authorize, contacts.add);
    app.post('/app/contacts/upload/start', filter.authorize, contacts.startUpload);
    app.post('/app/contacts/upload/end', filter.authorize, contacts.endUpload);

    app.get('/app/index', function (req, res) {
        res.render('index');
    });
    app.get('/index', function (req, res) {
        res.render('index');
    });

    app.get('/jade/:jade',render.renderJade);

    app.post('/app/sign/signup', sign.signup);
    app.post('/app/sign/login', sign.login);
    app.get('/app/sign/active', sign.active);
    app.get('/app/sign/logout', sign.logout);

    app.get('/app/settings', settings.showSettings);

    app.get('*', filter.authorize, function (req, res) {
        var name=req.session.user.email;
        res.render('layout',{
            name:name
        });
    });
}