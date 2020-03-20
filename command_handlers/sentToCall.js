module.exports = {
	name: 'sent',
	description: 'response command to existing defcall',
	execute(message, args) {
		if (!this.storage.deffcalls.has(args[0])) {
			message.channel.send('Wrong deffcall id or deffcall does not exist');
			return;
		}
		if (args[1].endsWith('k')) args[1] = +args[1].slice(0, -1) * 1000;
		if (args[2].endsWith('k')) args[2] = +args[2].slice(0, -1) * 1000;
		if (args.length < 3) {
			message.channel.send('Not enough arguments to change existing defcall');
			return;
		}
		if (isNaN(+args[1]) || isNaN(+args[2])) {
			message.channel.send('2nd and 3rd arguments should be numbers or end with "k"');
			return;
		}

		let call = this.storage.deffcalls.get(args[0]);
		call[2] -= +args[1];
		call[3] -= +args[2];
		if (call[2] <= 0 && call[3] <= 0) {
			this.storage.deffcalls.delete(args[0]);
			message.channel.send(`@everyone, deffcall "${args[0]}" is closed. Thanks to everyone who sent reinforcements.`);
			return;
		}
		message.channel.send(`@everyone, deffcall "${args[0]}" still need ${call[2] > 0 ? call[2] + " of infantry" : ""} ${call[3] > 0 ? call[3] + " of cavalry" : ""}, before ${call[1]}`);
		this.storage.deffcalls.set(args[0], call);
	}
};