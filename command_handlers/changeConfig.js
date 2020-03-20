const fs = require('fs');
module.exports = {
    name: 'config',
    description: 'Alows to edit configuration file',
    execute(message, props) {
        if (!props) {
            message.channel.send('No config values entered.\nex: *config key:value');
            return;
        }

        for (let prop of props) {
            if (prop.indexOf(":") < 0) {
                message.channel.send('Wrong argument format.\nex: *config key:value');
                return;
            }
            let arg = prop.split(":");
            if (arg[0] != "user" && arg[0] != "pass" && arg[0] != "url" && arg[0] != "agent") {
                message.channel.send('Unknown config key.\nex: *config key:value');
                return;
            }
        }

        for (let i = 0; i < props.length; i++) {
            let arg = props[i].split(":");
            this.config[arg[0]] = arg[1];
        }

        this.setConfig();
        message.channel.send('New config applied!');

        let data = JSON.stringify(this.config, null, 2);
        fs.writeFile('config.json', data, (err) => {  
            if (err) message.channel.send(`Couldn't save to file. Error: ${err}`);
            message.channel.send('Config file successfully saved!');
        });
    }
};