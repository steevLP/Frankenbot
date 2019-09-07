const { RichEmbed } = require('discord.js');
const { red, yellow } = require('../json/botconfig.json');
const fs = require('fs');
const ms = require('ms');
const { file, randomize } = require('watchbotapi');
let h = require('./history');

const error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings, date) => {
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
    let UUID = message.guild.id+"-"+kUser.id+"-"+randomize.single('999999999');

    //Errorhandling
    if (!kUser) return message.channel.send(userNotFound);
    if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(invalidPermission);
    if (!args[0] || args[0] == "help") return message.reply(cmdHelp);
    if (!kickChannel) return message.channel.send(channelError);
    if (!kReason) return message.channel.send(invalidReason);
    if (kUser.hasPermission("KICK_MEMBERS")) return message.reply(userHasPermisson);

    // Incedents Embed Definition
    let IkickEmbed = new RichEmbed()
        .setColor(red)
        .addField("GeKickter User", `${kUser.user.username}`)
        .addField("GeKicked von", `${message.author.username}`)
        .addField("Im Channel", message.channel)
        .addField("Kick Zeit", message.createdAt)
        .addField("Kick Grund", kReason);
    kickChannel.send(IkickEmbed); // Sendet das Embed in den Eingestellten Channel

    // User Embed Definition
    let UkickEmbed = new RichEmbed()
        .setColor(red)
        .setDescription('Du wurdest gekickt')
        .addField("Du wurdest gekicked von", `${message.author.username}`)
        .addField("Uhrzeit", message.createdAt)
        .addField("Mit dem Grund", kReason);
    kUser.send(UkickEmbed); // Sendet das Embed an den Nutzer

    // Kickt den Nutzer
    setTimeout(function () {
        server.query("INSERT INTO kick SET ?",{
            serverid: message.guild.id,
            uuid: kUser.id,
            punid: UUID,
            channel: message.channel,
            operator: message.author.username,
            username: kUser.user.username,
            reason: kReason            
        }, (error, results, fields) => {
            if(error) throw error;
        })
        message.guild.member(kUser).kick(kReason);
        h.insert(server, [message.guild.id, kUser.id, UUID, 'Kick', kReason]);        
    }, ms('500'));
}

module.exports.help = {
    name: "kick"
}