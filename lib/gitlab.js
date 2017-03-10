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

	issues(projectId) {
		return get.call(this, `projects/${projectId}/issues`);
	}

}

module.exports = Gitlab;