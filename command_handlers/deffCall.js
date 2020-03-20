module.exports = {
	name: 'defcall',
	description: 'Organize def call',
	execute(message, args) {
		if (args[3].endsWith('k')) args[3] = +args[3].slice(0, -1) * 1000;
		if (args[4].endsWith('k')) args[4] = +args[4].slice(0, -1) * 1000;
		if (args.length < 5) {
			message.channel.send('Not enough arguments to set def call');
			return;
		}
		if (isNaN(+args[3]) || isNaN(+args[4])) {
			message.channel.send('4th and 5th arguments should be numbers or end with "k"');
			return;
		}

		let call = args.slice(1);
		this.storage.deffcalls.set(args[0], call);
		message.channel.send(`@everyone, please send Def to ${args[1]} if it can arrive before ${args[2]} server time. Defcall ID is "${args[0]}". Required ${args[3]} infantry and ${args[4]} cavalry.${args[5] ? " Support your troops with crop!!" : ""}`);
	}
};