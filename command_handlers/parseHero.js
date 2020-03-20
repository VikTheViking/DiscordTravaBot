const heroParser = require('../utils/heroParser');

module.exports = {
	name: 'parse',
	description: "Parse any player's hero on a server",
	execute(message, username) {
		if (!username) {
			message.channel.send(`You should enter player's name to process!`);
			return;
		}

		if (username.length > 1) {
			message.channel.send(`You can parse only one hero at the time!`);
			return;
		}

		message.channel.send(`Trying to parse ${username[0]}'s hero. Please wait, it may take few seconds!`);

		let rank, lvl, exp, url, img, icn, race;

		return this.http.getRequest(this.config.url + "/statistiken.php?id=3")
		.then (body => {
			let dom = this.http.getDom(body);
			if (dom.window.document.getElementsByName("login")[0]) {
				let logId = dom.window.document.getElementsByName("login")[1].value;
				console.log("logged in");
				return this.http.login(logId, this.config.url + "/statistiken.php?id=3");
			} else return body;
		})
		.then (body => {
			let dom = this.http.getDom(body);
			let rank = dom.window.document.getElementsByName("rank")[0].value;
			let form = {
				rank: rank,
				name: username[0],
				submit: "OK"
			};
			return this.http.postRequest(this.config.url + "/statistiken.php?id=3", form);
		})
		.then(body => {
			let dom = this.http.getDom(body);
			if (dom.window.document.querySelector("p.error")) {
				message.channel.send(`Player ${username[0]} not found`);
				throw new Error("Username not found!");
			}
			let target = dom.window.document.getElementsByClassName("hl")[0];
			
			rank = target.cells[0].innerHTML.slice(0, -1);
			lvl = target.cells[2].innerHTML;
			exp = target.cells[3].innerHTML;
			url = this.config.url + '/' + target.cells[1].firstElementChild.href;
			return url;
		})
		.then(href => {
			let time = this.http.getRandom(2000);
			return new Promise ((resolve, reject) => {
				setTimeout(() => {resolve(href);}, time);
			})
		})
		.then(href => {
			return this.http.getRequest(href);
		})
		.then(body => {
			let dom = this.http.getDom(body);
			img = this.config.url + dom.window.document.getElementsByClassName("heroImage")[1].src;
			icn = img.replace('body', 'head').replace('profile', 'sideinfo');
			race = dom.window.document.getElementById("details").firstElementChild.rows[1].cells[1].innerHTML;
			let info = heroParser(img, lvl, race);

			let f1 = new this.Discord.Attachment(this.http.getStream(img), 'image.png');
			let f2 = new this.Discord.Attachment(this.http.getStream(icn), 'icon.png');
			const content = {
				color: 0x000000,
				title: username[0],
				url: url,
				thumbnail: {
					url: 'attachment://icon.png'
				},
				image: {
					url: 'attachment://image.png',
				},
				fields: [
					{
						name: "Position",
						value: `:star: **Rank:** ${rank}; :bar_chart: **Level:** ${lvl}; :zap: **Experience:** ${exp};`
					},
					{
						name: "Hero's Items",
						value: `<:t_horse:586927658764468238> **Horse:**
								${info[0][0]}
								<:helmet:586927658340712478> **Helmet:**
								${info[0][1]}
								<:right_hand:586927658432987149> **Right Hand Item:**
								${info[0][2]}
								<:left_hand:586927658827382809> **Left Hand Item:**
								${info[0][3]}
								<:armour:586927658382917643> **Armour:**
								${info[0][4]}
								<:boots:586927658114351134> **Boots:**
								${info[0][5]}`,
						inline: true
					},
					{
						name: `Hero's item bonuses${info[2] ? " + hero attributes" : ""}`,
						value: `${info[1].map(arr => `:white_small_square: __${arr[0]}__ ${arr[1]};`).join("\n")}`,
						inline: true
					}
				]
			};

			message.channel.send({ files: [f1, f2], embed: content });
		})
		.catch(error => {
		    message.channel.send("Couldn't parse hero due to internal error");
		    console.log(`Couldn't parse hero. Error: ${error}`);
		});
	}
};