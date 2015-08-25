var config = require('../config');

//管理员权限检测
exports.checkAuth = function (req, res, next) {
    if (req.session.user&&req.session.user.role==='root') {
        res.locals.user = req.session.user;
        req.user = req.session.user;
        next();
    } else {
        var cookie = req.cookies?req.cookies[config.cookieName]:false;
        if (cookie) {
            var authToken = tool.decrypt(cookie, config.secret);
            var auth = authToken.split('\t');
            var userId = auth[0];
            var user = {id:'-1', login:'root', nickname:'SM', name:'管理员', email:'cn.liuht@gmail.com', role:'root'};
            
            if (userId=='-1'&&user&&user.role==='root') {
                req.session.user = user;
                req.user = user;
                res.locals.user=req.session.user;
                next();
            } else  {
                res.redirect("/login");
            }
        }else{
            res.redirect("/login");
        }
    }
}
