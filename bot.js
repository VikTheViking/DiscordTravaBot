const fs = require('fs');
const Http = require('./utils/http');
const commandProcessor = require('./commandProcessor');

class AI {
    constructor() {
        this.config = require('./config.json');
        this.http = new Http(this.config);
        this.mapSize = this.getMapSize();
        this.Discord = require('discord.js');
        this.client = new this.Discord.Client();
        this.commands = new this.Discord.Collection();
        this.storage = require('./storage');
        this.setCommands();
 
        this.client.on('ready', () => {
            console.log("Connected as " + this.client.user.tag);
        });
        this.client.on('message', (receivedMessage) => {
            if (receivedMessage.author == this.client.user) { 
                return;
            }
            
            if (receivedMessage.content.startsWith("*")) {
                commandProcessor.call(this, receivedMessage);
            }
        });
        this.client.login(this.config.token);
    }

    setConfig() {
        this.http = new Http(this.config);
    }

    setCommands() {
        const commandFiles = fs.readdirSync('./command_handlers').filter(file => file.endsWith('.js'));

        for (let file of commandFiles) {
            const command = require(`./command_handlers/${file}`);
            this.commands.set(command.name, command);
        }
    }

    getMapSize() {
        this.http.getRequest(this.config.url)
        .then(body => {
            if (body.search(/"Map":{"Size":{"width":\d+/) > 0) {
                let size = +body.match(/"Map":{"Size":{"width":\d+/)[0].match(/\d+/)[0];
                return (size - 1) / 2;
            }
        })
        .catch(err => {
            console.log(`Can't get map size. Error: ${err}`);
        })
    }
}

module.exports = AI;