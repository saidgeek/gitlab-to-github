'use strict';

const path = require('path');
const exec = require('child_process').exec;
class Git {

  /**
   * Contructor of git module
   * @param {*} config config of gitlab and github
   */
  constructor(basePath, config) {
    this.config = config;
    this.basePath = basePath;
  }

  /**
   * Migratio repo of gitlab to github
   * @param {*} gitlabName Name of the repo in gitlab
   * @param {*} githubName Name of the repo in github
   */
  cloneMirror(gitlabName, githubName) {
    const gitlabRemote = `${this.config.gitlab.gitUrl}:${gitlabName}.git`;

    return new Promise((rv, rj) => {
      exec(`git clone --mirror ${gitlabRemote} ${path.join(this.basePath, `${gitlabName.split('/')[1]}.git`)}`, (err, stdout, stderr) => !err ? rv(stdout) : rj(err));
    });
  }

  pushMirror(gitlabName, githubName) {
    const githubRemote = `git@github.com:${this.config.github.org}/${githubName}.git`;

    return new Promise((rv, rj) => {
      exec(`cd ${path.join(this.basePath, `${gitlabName.split('/')[1]}.git`)} && git remote add github ${githubRemote} && git push github --mirror`, (err, stdout, stderr) => !err ? rv(stdout) : rj(err))
    })
  }

}

module.exports = Git;
