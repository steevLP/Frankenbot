const {
    version
} = require('watchbotapi');
const {
    RichEmbed
} = require('discord.js');
const {
    red
} = require('../json/botconfig.json');
const {
    file
} = require('watchbotapi');
module.exports.run = async (bot, message, args, server, settings) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(invalidPermiossion);
    message.delete();

    //error messaging
    let notanumber = new RichEmbed()
        .setColor(red)
        .addField("Der Warn Name muss eine Zahl sein", "!punish <add | remove | edit> <Zahl> <Option> <Zeit(Wenn nötig)>");

    //Import
    let cPunish = file.import('./json/punish.json');

    if (!args[0] || args[0] === "help") {
        //Befehl Erklärung
    }

    if (args[0] === "add") {
        let p;

        switch (args[2]) {
            case 'ban':
                p = '';
                break;
            case 'mute':
                p = '';
                break;
            case 'kick':
                p = '';
                break;
            case 'tempban':
                p = args[3];
                break;
            case 'tempmute':
                p = args[3];
                break;
        }


        if (isNaN(args[1])) return message.channel.send(notanumber);
        //Neue Strafe hinzufügen
        console.log(p);
        if (!cPunish[message.guild.id]) {
            cPunish[message.guild.id] = {
                [args[1]]: {
                    warnamt: args[1],
                    punishment: args[2],
                    length: p
                }
            }
            file.save('./json/punish.json', cPunish);
        } else {
            cPunish[message.guild.id][args[1]] = {
                warnamt: args[1],
                punishment: args[2],
                length: p
            }
            file.save('./json/punish.json', cPunish);
        }

        let added = new RichEmbed()
            .setColor(green)
            .addField("Erfolgreich", "Die definiert strafe wurde Hinzugefügt");

        message.channel.send(added);
    }

    if (args[0] === "edit") {
        //Bearbeite Strafe
        if (!cPunish[message.guild.id]) return message.channel.send(noPunishment);

        let p;

        switch (args[2]) {
            case 'ban':
                p = '';
                break;
            case 'mute':
                p = '';
                break;
            case 'kick':
                p = '';
                break;
            case 'tempban':
                p = args[3];
                break;
            case 'tempmute':
                p = args[3];
                break;
        }

        cPunish[message.guild.id][args[1]] = {
            warnamt: args[1],
            punishment: args[2],
            length: p
        }

        file.save('./json/punish.json', cPunish);

        let edited = new RichEmbed()
            .setColor(green)
            .addField("Erfolgreich", "Die definiert strafe wurde Bearbeitet").then(msg => {
                msg.delete(5000)
            });

        message.channel.send(edited);
    }

    if (args[0] === "remove") {

        let removed = new RichEmbed()
            .setColor(green)
            .addField("Erfolgreich", "Die definiert strafe wurde gelöscht");

        message.channel.send(removed);

        //Entferne Strafe
        delete cPunish[message.guild.id][args[1]];
        file.save('./json/punish.json', cPunish);
    }
}
module.exports.help = {
    name: "punish"
}