'use strict';

const request = require('request-promise');
const httpPromise = request.defaults({ json: true });

function req(method, path, body) {
  let url = `https://${this.config.username}:${this.config.token}@api.github.com/repos/${this.config.org}/${path}`;
  return httpPromise[method](url, { headers: { 'User-Agent': `${this.config.org}` }, body })
}

class Github {

  constructor(repoName, config) {
    this.config = config;
    this.repoName = repoName;
  }

  existsRepo() {
    let url = `https://${this.config.username}:${this.config.token}@api.github.com/orgs/${this.config.org}/repos`
    return httpPromise.get(url, { headers: { 'User-Agent': `${this.config.org}` } })
      .then(repos => repos && repos.find(r => r.name == this.repoName))
  }

  /**
   * Create new repo in github from the migration process
   * @param {*} name Name of the new repo in github
   */
  createRepo() {
    let url = `https://${this.config.username}:${this.config.token}@api.github.com/orgs/${this.config.org}/repos`;
    let body = { name: this.repoName };
    if (this.config.teamId) body.team_id = this.config.teamId;
    if (this.config.private) body.private = this.config.private;
    return this.existsRepo()
      .then(repo => !repo ? httpPromise.post(url, { headers: { 'User-Agent': `${this.config.org}` }, body }) : repo);
  }

  getMilestones() {
    return req.call(this, 'get', `${this.repoName}/milestones`)
  }

  createMilestone(milestone) {
    let body = {
      title: milestone.title,
      state: milestone.state === 'active' ? 'open' : 'closed',
      description: milestone.description,
      due_on: new Date(milestone.due_date)
    };
    return req.call(this, 'post', `${this.repoName}/milestones`, body)
  }

  getIssue(iid) {
    return req.call(this, 'get', `${this.repoName}/issues/${iid}`);
  }

  createIssue(issue) {
    let body = {
      state: ['opened', 'reopened'].indexOf(issue.state) > -1 ? 'open' : 'closed',
      title: issue.title,
      body: issue.description,
      lebels: issue.lebels || []
    };

    return this.getMilestones()
      .then(milestones => milestones.find(m => issue.milestone && issue.milestone.iid === m.number))
      .then(milestone => {
        if (milestone) body.milestone = milestone.number;
        return req.call(this, 'post', `${this.repoName}/issues`, body)
          .then(result => {
            return req.call(this, 'patch', `${this.repoName}/issues/${result.number}`, body)
          })
      })
  }

  createNotes(projectId, issueIid, note) {
    return req.call(this, 'post', `${this.repoName}/issues/${issueIid}/comments`, { body: note.body });
  }

}

module.exports = Github;