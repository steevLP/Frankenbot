const {file, randomize} = require('watchbotapi');
const {RichEmbed} = require('discord.js');
const ms = require('ms');
const {red, yellow, green} = require('../json/botconfig.json');

let error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {
    switch(args[0]){
        case 'new':
        break;
        case 'existing':
        break;
        case 'help':
        break;
    }
}

module.exports.help = {
    name: "register"
}