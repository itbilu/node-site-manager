exports.index = function (req, res, next) {
	res.render('index', { title: 'IT笔录－站点管理系统', layout:'layout', menu:'index' });	
}

exports.user = require('./user');
exports.site = require('./site');