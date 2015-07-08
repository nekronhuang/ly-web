exports.authorize = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/index');
    }
}
exports.restAuthorize=function(req,res,next){
    if (req.session.user) {
        next();
    } else {
        res.status(404).end();
    }
}