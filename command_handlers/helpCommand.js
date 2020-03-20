module.exports = {
	name: 'help',
	description: 'Displays all command list',
	execute(message, props) {
		console.log(props);
		if (!props) {
			let cnds = '';
			this.commands.forEach(cnd => cnds += `*${cnd.name} - ${cnd.description}\n`);
			message.channel.send(`List of all commands:\n${cnds}`);
		} else if (props.length == 1) {
			if (this.commands.get(props[0])) message.channel.send(`Command description:\n*${this.commands.get(props[0]).name} - ${this.commands.get(props[0]).description}`);
			else message.channel.send("Can't find requested command");
		} else {
			message.channel.send(`Use command without argument for all commands help or with only one argument for specific command help`);
			return;
		}		
	}
};