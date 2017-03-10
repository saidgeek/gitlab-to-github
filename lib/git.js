'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

class Git {

	constructor(config) {
		this.config = config;
		this.basePath = path.join(__dirname, '..', 'repos');
		if (!fs.existsSync(this.basePath)) shell.mkdir(this.basePath);
	}

	/**
	 * Migratio repo of gitlab to github
	 * @param {*} gitlabName Name of the repo in gitlab
	 * @param {*} githubName Name of the repo in github
	 */
	migrateRepo(gitlabName, githubName) {
		const repo = `${gitlabName.split('/')[1]}.git`;
    const gitlabRemote = `${this.config.gitlab.gitUrl}:${gitlabName}.git`;
    const githubRemote = `git@github.com:${this.config.github.org}/${githubName}.git`;

		const repoPath = path.join(this.basePath, `${repo}`);
		let shellResult = null;
		if (fs.existsSync(repoPath)) shellResult = shell.rm('-rf', repoPath).code;
		debugger;
		shellResult = shell.exec(`git clone --mirror ${gitlabRemote} ${repoPath}`).code;
		if (shellResult === 0) return Promise.reject(new Error('Error in the cloning repo of gitlab.'));
		return Promise.resolve(true)
	}

}

module.exports = Git;
