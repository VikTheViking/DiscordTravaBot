const {JSDOM} = require('jsdom');
const request = require('request-promise-native');
const singleReq = require('request');

class Http {
	constructor(config) {
		this.config = config;
		this.cookiejar = request.jar();
	}

	getRandom(x) {
		x = Math.round(x*0.8);
		return x + Math.round(Math.random() * x * 0.5);
	}

	getDom(body) {
		return new JSDOM(body);	
	}

	request(options) {
		let time = this.getRandom(2000);
		return new Promise ((resolve, reject) => {
			setTimeout(() => {resolve();}, time);
		})
		.then(() => {
			return request(options);
		})
		.catch(error => {
		    console.log(`Can't get page. Error: ${error}`);
		});
	}

	getStream(url) {
		let options = {
			method: 'GET',
			url: url,
			jar: this.cookiejar,
			headers: {
		    	'User-Agent': this.config.agent
			}
		};
		return singleReq(options);
	}

	getRequest(url) {
		let options = {
			uri: url,
			jar: this.cookiejar,
			headers: {
				'User-Agent': this.config.agent
			}
		};
		let time = this.getRandom(2000);
		return new Promise ((resolve, reject) => {
			setTimeout(() => {resolve();}, time);
		})
		.then(() => {
			return request(options);
		})
		.catch(error => {
		    console.log(`Can't get page. Error: ${error}`);
		});
	}

	postRequest(url, form) {
		let options = {
		    method: 'POST',
		    uri: url,
		    jar: this.cookiejar,
		    form: form,
		    headers: {
		        'User-Agent': this.config.agent
		    }
		};
		let time = this.getRandom(2000);
		return new Promise ((resolve, reject) => {
			setTimeout(() => {resolve();}, time);
		})
		.then(() => {
			return request(options)
		})
		.catch(error => {
		    console.log(`Couldn't post data. Error: ${error}`);
		});
	}

	login(logId, url) {
		let form = {
		    name: this.config.user,
			password: this.config.pass,
			s1: "Login",
			w: "1366%3A768",
			login: logId
		};
		let time = this.getRandom(2000);
		return new Promise ((resolve, reject) => {
			setTimeout(() => {resolve(logId);}, time);
		})
		.then(logId => {
			return this.postRequest(this.config.url + '/dorf1.php', form);
		})
		.then(() => {
			return this.getRequest(url);
		})
		.catch(error => {
		    console.log(`Couldn't login. Error: ${error}`);
		});
	}
}

module.exports = Http;