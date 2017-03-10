'use strict';

const config = require('./config.json');
const Git = require('./lib/git');
const Gitlab = require('./lib/gitlab');

console.log(config)

const git = new Git(config);
const gitlab = new Gitlab(config.gitlab);

let p = Promise.resolve();

const projectId = 1775437;
const gitlabName = 'nedmedia/wp-radios';
const githubName = 'wp-radios';

const db = {};

Promise.all([
	gitlab.milestones(projectId),
	gitlab.issues(projectId)
])
.then(results => {
	db.milestones = results[0].length && results[0] || null;
	db.issues = results[1].length && results[1] || null;
	// NOTE: agregar db.wiki

	return git.migrateRepo(gitlabName, githubName)
})
.then(result => {
	debugger;
})
.catch(err => console.error(err));