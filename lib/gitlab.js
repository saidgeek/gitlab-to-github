'use strict';

const path = require('path');
const querystring = require('querystring');
const _ = require('lodash');
const fse = require('fs-extra-promise');
const request = require('request-promise');
const httpPromise = request.defaults({ json: true });
//"#{GITLAB_URL}/api/v3/#{path}?private_token=#{GITLAB_TOKEN}&per_page=1000"


function get(path, params) {
  let query = {
    private_token: this.config.token,
    per_page: '1000'
  };
  if (params) query = _.merge(query, params || {});
  let url = `${this.config.url}/api/v3/${path}?${querystring.stringify(query)}`;
  return httpPromise.get(url);
}

class Gitlab {

  constructor(config) {
    this.config = config;
  }

  /**
   * Listing milestones of a project
   * @param {*} id id of particular project in gitlab
   */
  milestones(id) {
    return get.call(this, `projects/${id}/milestones`)
      .then(milestones => milestones.sort((a, b) => a.id - b.id))
  }

  /**
   * Listing issues of a project
   * @param {*} id id of particular project in gitlab
   */
  issues(id) {
    return get.call(this, `projects/${id}/issues`, { sort: 'asc' });
  }

  notes(projectId, issueIid) {
    return get.call(this, `projects/${projectId}/issues/${issueIid}/notes`);
  }

}

module.exports = Gitlab;