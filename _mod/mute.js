const { RichEmbed } = require('discord.js');
const { red, green, yellow } = require('../json/botconfig.json');
const fs = require('fs');
const ms = require('ms');
const { file, randomize, time } = require('watchbotapi');
const error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {

    let channelError = error.channelError('ban');
    let cmdHelp = error.cmdHelp('Gemuted', '!mute <leer für perma | temp> <@mention> <Grund>');
    let userNotFound = error.userNotFound();
    let invalidPermission = error.invalidPermission('muten');
    let userHasPermisson = error.userHasPermisson('Gemuted');

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(invalidPermission);

    let mutechannel = message.guild.channels.find(`name`, settings.incedents);
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
    let mReason;
    let muterole = message.guild.roles.find(`name`, "🔇Muted");
    let mUUID = message.guild.id + "-" + tomute.id + "-" + randomize.single('999999999');

    message.delete();
    
    if (!tomute) return message.reply(userNotFound);
    if (tomute.hasPermission("MANAGE_MESSAGES")) return message.reply(userHasPermisson);
    if (!mutechannel) return message.reply(channelError);

    if (!muterole) {
        try {
            muterole = message.guild.createRole({
                name: "🔇Muted",
                color: "#000000",
                permissions: []
            });
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }


    switch (args[0]) {
        case 'perma':
                mReason = args.join(" ").slice(22);
                let muteEmbed = new RichEmbed()
                .setDescription("Mute")
                .setColor(red)
                .addField("Gemuted Von", message.author)
                .addField("Muted User", tomute)
                .addField("Im Channel", message.channel)
                .addField("Mute grund", mReason)
                .addField("Muteid", mUUID);
            mutechannel.send(muteEmbed);

            server.query("INSERT INTO mutes SET ?", {
                serverid: message.guild.id,
                uuid: tomute.id,
                duration: "infinit",
                punid: mUUID,
                state: "handled",
                channel: message.channel,
                operator: message.author.username,
                username: tomute.user.username,
                reason: mReason
            }, (error, results, fields  ) => {
                if(error) throw error;
            })

            tomute.send(muteEmbed);
            tomute.addRole(muterole.id)
        break;
        case 'temp':
                mReason = args.join(" ").slice(30);

                let mutetime = args[2];
                if (!mutetime) return message.reply(cmdHelp);
    
                let TEMPmuteEmbed = new RichEmbed()
                    .setDescription("Mute")
                    .setColor(red)
                    .addField("Gemuted Von", message.author)
                    .addField("Muted User", tomute)
                    .addField("Im Channel", message.channel)
                    .addField("Mute grund", mReason)
                    .addField("Mute Länge", time.convertToString([args[2]]))
                    .addField("Muteid", mUUID);
                mutechannel.send(TEMPmuteEmbed);
    
                server.query("INSERT INTO mutes SET ?", {
                    serverid: message.guild.id,
                    uuid: tomute.id,
                    duration: Date.now() + time.convertToMS([args[2]]),
                    punid: mUUID,
                    channel: message.channel,
                    operator: message.author.username,
                    username: tomute.user.username,
                    reason: mReason
                }, (error, results, fields  ) => {
                    if(error) throw error;
                })
    
                tomute.send(TEMPmuteEmbed);
                tomute.addRole(muterole.id)
        break;
        case "check":
            //Daten Definition
            let id = args[1];

            //Fehler Vergabe
            if (!mutechannel) return message.channel.send(channelError);
            if (!mutes[id]) return message.channel.send(muteNotFound);

            //Warn Anzeige
            let checkEmbed = new RichEmbed()
                .setColor(green)
                .setTitle(mutes[id].username)
                .addField("Name", mutes[id].username)
                .addField("UserID", mutes[id].userID)
                .addField("Warn Grund", mutes[id].reason)
                .addField("Verwarnt von", mutes[id].mutedBy)
                .addField("Verwant in Channel", mutes[id].channel)

            //Absendunge
            mutechannel.send(checkEmbed).then(err => {
                if (err) throw err;
            });
        break;
    }
}

module.exports.help = {
    name: "mute"
}