const Discord = require("discord.js");
const botconfig = require('../json/botconfig.json');
const watchbot = require('watchbotapi');
const fs = require("fs");
const green = botconfig.green;

module.exports.run = async (bot, message, args, server, settings) => {
    const msg = await message.channel.send("Pinging");
    msg.edit(`Dein Ping: ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Ping: ${Math.round(bot.ping)}ms`);
}

module.exports.help = {
    name: "ping"
}