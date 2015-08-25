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
		socket.on('exec', function(data){
			var arg = _makeCmd(data);
			var child = child_process.spawn(arg.cmd, arg.args, {cwd:arg.cwd});
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

//构建命令
function _makeCmd(data){
	var sites = config.sites;
	var  servers = config.servers;
	var cmd = '';
	var args = [];
	var cwd = '';
	switch(data.cmd){
		case 'pull':
			cmd = 'git';
			args = ['pull'];
			cwd =  servers[data.server].wwwPath + sites[data.site].path;
			break;
		case 'restart':
			cmd = sites[data.site].restart.cmd;
			args = sites[data.site].restart.args;
			cwd =  servers[data.server].wwwPath + sites[data.site].path;
			break;
		case 'npm':
			cmd = 'npm';
			args = ['install'];
			cwd =  servers[data.server].wwwPath + sites[data.site].path;
			break;
		case 'log':
			cmd = 'tail';
			args = ['-f', servers[data.server].logPath + sites[data.site].logfile];
			cwd =  '/';
			break;
	}

	return {
		cmd: cmd,
		args: args,
		cwd: cwd
	}
}