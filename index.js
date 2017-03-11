'use strict';

const fse = require('fs-extra-promise');
const path = require('path');
const config = require('./config.json');
const Git = require('./lib/git');
const Gitlab = require('./lib/gitlab');


const projectId = 1775437;
const gitlabName = 'nedmedia/wp-radios';
const githubName = 'wp-radios';
const db = {};

const basePath = path.join(__dirname, 'repos', gitlabName);
const git = new Git(basePath, config);
const gitlab = new Gitlab(basePath, config.gitlab);

fse.removeSync(path.join(basePath, 'git'));

fse.ensureDirAsync(basePath)
  .then(reposDir => Promise.all([
    git.migrateRepo(gitlabName, githubName),
    gitlab.milestones(projectId),
    gitlab.issues(projectId)
  ]))
  .then(results => {
    db.milestones = results[0].length && results[0] || null;
    db.issues = results[1].length && results[1] || null;
    // NOTE: agregar db.wiki
    debugger;
  })
  .then(result => {
    debugger;
  })
  .catch(err => console.error(err));


