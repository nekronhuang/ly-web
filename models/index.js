var MongoClient = require('mongodb').MongoClient,
    config = require('../config');

MongoClient.connect(config.mongo.db, function (err, _db) {
    if (err) {
        process.exit(1);
    } else {
        Date.prototype.Format = function(fmt) {
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)){
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o){
                if (new RegExp("(" + k + ")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
        exports.User=_db.collection('users');
        exports.Contact=_db.collection('contacts');
        exports.Note=_db.collection('notes');
        exports.Stat=_db.collection('statistics');
    }
});