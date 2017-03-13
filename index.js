'use strict';

const fse = require('fs-extra-promise');
const path = require('path');
const config = require('./config.json');
const Git = require('./lib/git');
const Gitlab = require('./lib/gitlab');
const Github = require('./lib/github');

/**
 * wp-radios
 * projectId = 1775437
 * gitlabName = 'nedmedia/wp-radios'
 * pergithubName = 'wp-radios'
 * 
 * personal test
 * projectId: 315367
 * gitlabName: kolekio/kolekio-api
 * githubName: ko-api
 */

const projectId = 315367;
const gitlabName = 'kolekio/kolekio-api';
const githubName = 'ko-api';
const db = {};

const basePath = path.join(__dirname, 'repos');
const git = new Git(basePath, config);
const gitlab = new Gitlab(config.gitlab);
const github = new Github(githubName, config.github);

fse.removeSync(path.join(basePath, `${gitlabName.split('/')[1]}.git`));

fse.ensureDirAsync(basePath)
  .then(reposDir => Promise.all([
    git.cloneMirror(gitlabName, githubName),
    gitlab.milestones(projectId),
    gitlab.issues(projectId)
  ]))
  .then(results => {
    db.milestones = results[1].length && results[1] || null;
    db.issues = results[2].length && results[2] || null;
    debugger;

    let p = Promise.resolve();
    p = p.then(() => github.createRepo())
    p = p.then(() => git.pushMirror(gitlabName, githubName));

    db.milestones.forEach(m => {
      p = p.then(() => github.createMilestone(m));
    });

    db.issues.forEach(issue => {
      p = p.then(() => github.createIssue(issue));
      p = p.then(() => gitlab.notes(projectId, issue.id)
        .then(notes => Promise.all(notes.map(n => github.createNotes(projectId, issue.iid, n))))
        .catch(err => {
          console.log(err)
          return true
        })
      );
    });

    return p.then(() => (true));
  })
  .then(result => {
    debugger;
  })
  .catch(err => console.error(err));


