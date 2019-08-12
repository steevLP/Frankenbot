const { RichEmbed } = require('discord.js');
const { red, green, yellow } = require('../json/botconfig.json');
const fs = require('fs');
const ms = require('ms');
const { file, randomize } = require('watchbotapi');
const error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {

    let channelError = error.channelError('ban');
    let cmdHelp = error.cmdHelp('Gemuted', '!mute <leer für perma | temp> <@mention> <Grund>');
    let userNotFound = error.userNotFound();
    let invalidPermission = error.invalidPermission('muten');
    let userHasPermisson = error.userHasPermisson('Gemuted');

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(invalidPermission);


    let mutechannel = message.guild.channels.find(`name`, settings.incedents);

    message.delete();
    
    switch (args[0]) {
        default:

            let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            let mReason = args.join(" ").slice(25);
            let mutetime = args[1];
            let muterole = message.guild.roles.find(`name`, "🔇Muted");

            //Warn Datenbank Definition
            let mID = file.import('./json/mutes.json');
            let mUUID = message.guild.id + "-" + tomute.id + "-" + randomize.single('999999999');

            if (!tomute) return message.reply(userNotFound);
            if (tomute.hasPermission("MANAGE_MESSAGES")) return message.reply(userHasPermisson);
            if (!mutetime) return message.reply(cmdHelp);
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

            let muteEmbed = new RichEmbed()
                .setDescription("Mute")
                .setColor(red)
                .addField("Gemuted Von", message.author)
                .addField("Muted User", tomute)
                .addField("Im Channel", message.channel)
                .addField("Mute grund", mReason)
                .addField("Mute Länge", mutetime)
                .addField("Muteid", mUUID);
            mutechannel.send(muteEmbed);

            if (!mID[mUUID]) {
                mID[mUUID] = {
                    username: tomute.user.username,
                    userID: tomute.id,
                    reason: mReason,
                    mutedBy: message.author.username,
                    channel: message.channel.name,
                };
                file.save('./json/mutes.json', mID);
            }

            tomute.send(muteEmbed);
            tomute.addRole(muterole.id)

            setTimeout(function () {

                let unMuted = new RichEmbed()
                    .setColor(green)
                    .addField(`${tomute.user.username} Wurde entmuted`, `<@${tomute.id}> Du wurdest Entmuted, bitte beachte ab jetzt die Regeln!`);

                tomute.removeRole(muterole.id);
                message.channel.send(unMuted);
            }, ms(mutetime));
            break;
        case "check":
            //Daten Definition
            let mutes = file.import('./json/mutes.json');
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