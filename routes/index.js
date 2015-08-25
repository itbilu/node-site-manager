var express = require('express');
var router = express.Router();
var web = require('../controller');
var config = require('../config');
var middleware = require('./middleware');

/* GET home page. */
router.all('/*', function(req, res, next) {
	res.locals.title = 'IT笔录－站点管理系统';
	res.locals.description = 'IT笔录－站点管理系统-power by itbilu.com';
	res.locals.sites = config.sites;
	res.locals.servers = config.servers;
	if(req.session.alert)
    {
    	res.locals.alert=req.session.alert;
    	req.session.alert=null;
    }
    next();
});
router.get('/', middleware.checkAuth, web.index);
router.get('/login', web.user.login);
router.post('/login', web.user.login);
router.get('/logout', middleware.checkAuth, web.user.logout);
router.get('/site/:site', middleware.checkAuth, web.site.site);

module.exports = router;
