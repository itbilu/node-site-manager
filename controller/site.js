var child_process = require('child_process');
var config = require('../config');

exports.site = function (req, res, next) {
	var key = req.params.site;
	var server = '';
	var sites = config.sites;
	var  servers = config.servers;
	if(Array.isArray(sites[key].host)){
		server = sites[key].host[0];
		if(req.query.server&&servers[server]){
			server = req.query.server;
		}
	} else {
		server = sites[key].host;
	}
	res.render('site.html', {menu: 'site', key:key, server:server});
}

exports.socket = function(server){
	var io = require('socket.io')(server);
	var site = io.of('/socket/site');
	//连接对象
	site.on('connection', function (socket) {		
		socket.on('exec', function(date){
			var sites = config.sites;
			var  servers = config.servers;
			var cmd = '';
			var args = [];
			var cwd = '';
			switch(date.cmd){
				case 'pull':
					cmd = 'git';
					args = ['pull'];
					cwd =  servers[date.server].wwwPath + sites[date.site].path;
					break;
				case 'restart':
					cmd = sites[date.site].restart.cmd;
					args = sites[date.site].restart.args;
					cwd =  servers[date.server].wwwPath + sites[date.site].path;
					break;
				case 'npm':
					cmd = 'npm';
					args = ['install'];
					cwd =  servers[date.server].wwwPath + sites[date.site].path;
					break;
				case 'log':
					cmd = 'tail';
					args = ['-f', servers[date.server].logPath + sites[date.site].logfile];
					cwd =  '/';
					break;
			}

			var child = child_process.spawn(cmd, args, {cwd:cwd});
	    	//打印子进程的输出数据
			child.stdout.on('data', function (data) {
				// console.log(data);
				socket.emit('data', data.toString());
			});

			//监听子进程的错误流数据
			child.stderr.on('data', function (data) {
			  	console.log('stderr: ' + data.toString());
			  	socket.emit('err', data.toString());
			});

			//监听子进程的退出事件
			child.on('close', function (code) {
			  	console.log('子进程退出，code：' + code);
			  	socket.emit('err', '子进程退出，code：' + code);
			});
		});

	    //连接断开处理
	    socket.on('disconnect', function (){
	    	
		});
	});
}