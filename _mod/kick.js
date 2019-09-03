const { RichEmbed } = require('discord.js');
const { red, yellow } = require('../json/botconfig.json');
const fs = require('fs');
const ms = require('ms');
const { file } = require('watchbotapi');

const error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {
    /**
     * Verarbeitet und Überprüft 
     * Definiert den Kick Msg Channel
     * Ob der Nutzer die nötigen Rechte hat
     * Ob der zu kickende Nutzer nicht die nötigen Rechte hat also im Team ist
     * Ob es den Nutzer gibt
     * Das ein Grund angegeben ist
     */
    
    //Error handling
    let channelError = error.channelError('Kick');
    let cmdHelp = error.cmdHelp('Gekickt', '!kick <@mention> <Grund>');
    let userNotFound = error.userNotFound();
    let invalidPermission = error.invalidPermission('kicken');
    let userHasPermisson = error.userHasPermisson('Gekickt');
    let invalidReason = error.invalidReason("Kick");

    message.delete();

    //Daten Definition
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let kReason = args.join(" ").slice(22);
    let kickChannel = message.guild.channels.find(`name`, settings.incedents);

    //Errorhandling
    if (!kUser) return message.channel.send(userNotFound);
    if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(invalidPermission);
    if (!args[0] || args[0] == "help") return message.reply(cmdHelp);
    if (!kickChannel) return message.channel.send(channelError);
    if (!kReason) return message.channel.send(invalidReason);
    if (kUser.hasPermission("KICK_MEMBERS")) return message.reply(userHasPermisson);

    // Incedents Embed Definition
    let IkickEmbed = RichEmbed()
        .setColor(red)
        .addField("GeKickter User", `${kUser.nickname}`)
        .addField("GeKicked von", `${message.author.nickname}`)
        .addField("Im Channel", message.channel)
        .addField("Kick Zeit", message.createdAt)
        .addField("Kick Grund", kReason);
    kickChannel.send(IkickEmbed); // Sendet das Embed in den Eingestellten Channel

    // User Embed Definition
    let UkickEmbed = new RichEmbed()
        .setColor(red)
        .setDescription('Du wurdest gekickt')
        .addField("Du wurdest gekicked von", `${message.author.nickname}`)
        .addField("Im Channel", message.channel)
        .addField("Uhrzeit", message.createdAt)
        .addField("Mit dem Grund", kReason);

    kUser.send(UkickEmbed); // Sendet das Embed an den Nutzer

    // Kickt den Nutzer
    setTimeout(function () {
        message.guild.member(kUser).kick(kReason);
    }, ms('500'));
}

module.exports.help = {
    name: "kick"
}