const { RichEmbed } = require('discord.js');
const { red, yellow } = require('../json/botconfig.json');

const {randomize, time} = require('watchbotapi');

let error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {
}

module.exports = {
    'insert': function (server){
        console.log('beep boop beep' + server);
    }
}

module.exports.help = {
    name: "history"
}