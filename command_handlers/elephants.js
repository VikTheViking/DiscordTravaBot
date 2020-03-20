const distance = require('../utils/tileDist');

module.exports = {
	name: 'elephants',
	description: "Search for closest elephants to given coords",
	execute(message, coords) {
		if (!coords) {
			message.channel.send('You should enter coordinates to process!');
			return;
		}

		if (coords.length > 1) {
			message.channel.send('You entered more than one argument!');
			return;
		}

		if (coords[0].indexOf("|") < 0) {
			message.channel.send('Coordinates should be separated by "|" symbol!');
			return;
		}

		let ajaxToken;
		let values = coords[0].split("|");
		values.forEach(val => {
			if (val.search(/-?(−‭)?\d{1,3}/) < 0 || Math.abs(val) > this.mapSize) {
				message.channel.send('Invalid coordinates!');
				return;
			}
		});
		values = values.map(val => {return val.match(/-?(−‭)?\d{1,3}/)[0];}).map(val => {return val.replace(/(−‭)/, "-");});

		message.channel.send(`Searching for elephants close to ${coords[0]}. Please wait, it may take some time!`);

		return this.http.getRequest(this.config.url + `/karte.php?x=${values[0]}&y=${values[1]}`)
		.then (body => {
			let dom = this.http.getDom(body);
			if (dom.window.document.getElementsByName("login")[0]) {
				let logId = dom.window.document.getElementsByName("login")[1].value;
				console.log("logged in");
				return this.http.login(logId, this.config.url + `/karte.php?x=${values[0]}&y=${values[1]}`);
			} else return body;
		})
		.then (body => {
			ajaxToken = body.match(/'\w{32}/g)[1].slice(1);
			let options = {
			    method: 'POST',
			    uri: this.config.url + "/ajax.php?cmd=mapPositionData",
			    jar: this.http.cookiejar,
			    form: {
					"cmd": "mapPositionData",
					"data[x]": values[0],
					"data[y]": values[1],
					"data[zoomLevel]": 3,
					"ajaxToken": ajaxToken
			    },
			    headers: {
			        'User-Agent': this.config.agent,
			        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			        "X-Request": "JSON",
			        "X-Requested-With":	"XMLHttpRequest"
			    }
			};
			return this.http.request(options);
		})
		.then(async(body) => {
			let data = JSON.parse(body).response.data.tiles;
			data = data.filter(tile => {
				if (!tile.title) return false;
				else return (tile.title.startsWith("{k.fo}"));
			});
			
			for (let i = 0; i < data.length; i++) {
				let options = {
				    method: 'POST',
				    uri: this.config.url + "/ajax.php?cmd=viewTileDetails",
				    jar: this.http.cookiejar,
				    form: {
						"cmd": "viewTileDetails",
						"x": data[i].position.x,
						"y": data[i].position.y,
						"ajaxToken": ajaxToken
				    },
				    headers: {
				        'User-Agent': this.config.agent,
				        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				        "X-Request": "JSON",
				        "X-Requested-With":	"XMLHttpRequest"
				    }
				};
				await this.http.request(options)
				.then(body => {
					let info = JSON.parse(body).response.data.html;
					if (info.search(/u40/) < 0) data[i].status = false;
					else data[i].status = true;
				});
			}
			
			return data;	
		})
		.then(data => {
			data = data.filter(oasis => {
				return oasis.status;
			})
			.sort((a, b) => {
				let fst = [+a.position.x, +a.position.y];
				let snd = [+b.position.x, +b.position.y];
				return distance(values, fst) - distance(values, snd);
			});

			if (data.length) {
				data = data.map(plr => `:straight_ruler: ${distance(values, [plr.position.x, plr.position.y]).toFixed(1)} fields; :round_pushpin: (${plr.position.x}|${plr.position.y})`);
			
				let desc = "";
				let limit = (data.length < 15) ? data.length : 15;
				for (let i = 0; i < limit; i++) {
					desc += data[i] + "\n";
				}

				let content = {
					color: 0x000000,
					title: `Closest elephants to (${values[0]}|${values[1]})`,
					description: desc
				}

				message.channel.send({ embed: content });
			} else {
				message.channel.send('Elephants not found');
			}	
		})
		.catch(error => {
		    message.channel.send("Couldn't parse hero due to internal error");
		    console.log(`Couldn't parse hero. Error: ${error}`);
		});
	}
};