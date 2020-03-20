function commandProcessor(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1).trim(); // Remove the leading exclamation mark
    let primaryCommand, args;

    if (fullCommand.indexOf(" ") > 0) {
	    primaryCommand = fullCommand.split(/ +/)[0]; // The first word directly after the exclamation is the command
	    args = fullCommand.split(/ +/).slice(1).join(" ").split(", "); // All other words are arguments/parameters/options for the command
	} else {
		primaryCommand = fullCommand;
	}

    console.log("Command received: " + primaryCommand);
    console.log("Arguments: " + args); // There may not be any arguments

    if (!this.commands.has(primaryCommand)) {
    	receivedMessage.channel.send('I don\'t understand the command. Try "*help" for list of all commands.');
    	return;
    };

    try {
		this.commands.get(primaryCommand).execute.call(this, receivedMessage, args);
	} catch (error) {
		console.error(error);
		receivedMessage.reply('there was an error trying to execute that command!');
	}
}

module.exports = commandProcessor;