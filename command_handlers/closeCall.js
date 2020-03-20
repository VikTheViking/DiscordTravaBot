module.exports = {
	name: 'closeCall',
	description: 'Close existing deffcall',
	execute(message, args) {
		args.forEach(arg => {
			if (!this.storage.deffcalls.has(arg)) {
				message.channel.send(`Deffcall "${arg}" not found!`);
			} else {
				this.storage.deffcalls.delete(arg);
				message.channel.send(`Deffcall "${arg}" successfully closed!`);
			}
		})
	}
};