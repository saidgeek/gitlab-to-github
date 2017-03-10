'use strict';

const config = require('./config.json');
const Gitlab = require('./lib/gitlab');

console.log(config)

const gitlab = new Gitlab(config.gitlab);

gitlab.issues(1775437)
	.then(issues => issues.forEach(issue => console.log(issue)))
	.catch(err => console.error(err));