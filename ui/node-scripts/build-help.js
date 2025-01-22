console.log('Use following scripts for build app');
console.table({
	'npm run build:staging': {
		'use for': 'staging publish',
		Mode: 'staging',
		NODE_ENV: 'production'
	},
	'npm run build:production': {
		'use for': 'production publish',
		Mode: 'production',
		NODE_ENV: 'production'
	},
	'npm run build:development': {
		'use for': 'debug & live test',
		Mode: 'development',
		NODE_ENV: 'production'
	}
});
