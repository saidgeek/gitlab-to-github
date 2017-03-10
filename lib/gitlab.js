'use strict';

const request = require('request-promise');
const httpPromise = request.defaults({ json: true });
//"#{GITLAB_URL}/api/v3/#{path}?private_token=#{GITLAB_TOKEN}&per_page=1000"


function get(path) {
	console.log('this.config:', this.config)	
	let url = `${this.config.url}/api/v3/${path}?private_token=${this.config.token}&per_page=1000`;
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
		return get.call(this, `projects/${id}/milestones`);
	}

	/**
	 * Listing issues of a project
	 * @param {*} id id of particular project in gitlab
	 */
	issues(id) {
		return get.call(this, `projects/${id}/issues`);
	}

}

module.exports = Gitlab;