var path = require('path');

module.exports = {
	cookieName: "sm",
	secret: "KIid&%@gh",
	servers: {
		s1: {host:'sm.itbilu.com', wwwPath: '/alidata/www/', logPath: '/root/.forever/'},
    	s2: {host:'115.29.11.11:9999', wwwPath: '/home/data/', logPath: '/root/.forever/'}
	},
	sites: {
		ui: {
			name: '前端站点',
			type: 'html',
			host: 's1',
			path: 'itbilu_ui'
		},
		itbilu: {
			name: 'IT笔录',
			type: 'node',
			host: ['s1', 's2'],	//站点所在服务器
			path: 'itbilu',
			//日志文件名
			logfile: 'itbilu.log',
			//进程重启命令，此命令最终传给child_process执行，根据需要自行配置
			restart: {cmd: 'forever', args:['restart', 'itbilu']}
		}
	}
};

