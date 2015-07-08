var models = require('../models'),
    mongo = require('mongodb');

exports.openEmail =function(req,res){
    var insert={
        ips:req.ips,
        header:req.headers,
        number:req.query.number,
        time:new Date().Format('yyyy-MM-dd hh:mm:ss'),
        timestamp:Date.now(),
    }
    models.Stat.insert(insert,function(err){});
    res.status(200).end();
}

exports.redirectUrl=function(req,res){
    var insert={
        id:req.query.id,
        target:req.query.target,
    }
    console.log(insert,req.query.url);
    // models.Stat.insert(insert,function(err){});
    res.redirect('http://'+req.query.url);
}