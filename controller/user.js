var config = require('../config');
var tool = require('../lib/utils/tool');

//登录
exports.login = function(req, res, next)
{
	var method = req.method.toLowerCase();
	if(method === 'get'){
    	res.render('login');
    }else if(method === 'post' ){
        //用户名：root，密码:111111
        if(req.body.userName==='root'&&req.body.password==='96e79218965eb72c92a549dd5a330112'){
            var user = {id:'-1', login:'root', nickname:'SM', name:'管理员', email:'www@21jieyan.com', role:'root'};
            req.session.user = user;
            var authToken = tool.encrypt(user.id + '\t' + user.login + '\t' + user.email, config.secret);
            res.cookie(config.cookieName, authToken, {path: '/'});      //会话cookie
            console.log(req.session.user);
            res.redirect('/')
        }else{
            res.render('login', {message:'登录失败：用户名或密码错误', email:req.body.email });
        }
    }else{
    	next()
    }
}

//退出登录
exports.logout = function(req, res, next){
    if(req.session.user)
  	{
  		  delete req.session.user;
  	}
    if(req.user){
        req.user = null;
    }
  	res.clearCookie(config.cookieName, { path: '/' });
    res.redirect('/');
}