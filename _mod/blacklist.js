const {
    file
} = require('watchbotapi');
const {
    RichEmbed
} = require('discord.js');
const {
    red,
    green
} = require('../json/botconfig.json');
const error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {

    let invalidPermiossion = error.invalidPermiossion('Blacklisten');

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(invalidPermiossion);

    let blacklist = file.import('./json/blacklist.json');
    let spamfilter = blacklist[message.guild.id].list;

    message.delete();

    switch (args[0]) {
        default:
            let hEmbed = new RichEmbed()
                .setColor(red)
                .addField("Fehlerhafte eingabe!", "!blacklist <add | remove> <Wort>");

            message.channel.send(hEmbed).then(msg => {
                msg.delete(5000)
            });
            break;
        case 'add':
            spamfilter.push(args[1]);
            file.save('./json/blacklist.json', blacklist);

            let added = new RichEmbed()
                .setColor(green)
                .addField("Erfolgreich!", `__**${args[1]}**__ wurde in der Blacklist gespeichert und wird abjetzt gesperrt`);

            message.channel.send(added);
            break;
        case 'list':
            let blacklistEmbed = new RichEmbed()
                .setColor(green)
                .addField("Blacklist Worte", JSON.stringify(spamfilter));

            message.channel.send(blacklistEmbed).then(msg => {
                msg.delete(5000)
            });
            break;
        case 'remove':
            spamfilter.splice(spamfilter.indexOf(args[1]), 1);
            file.save('./json/blacklist.json', blacklist);

            let removed = new RichEmbed()
                .setColor(green)
                .addField("Erfolgreich!", `__**${args[1]}**__ wurde aus der Blacklist gelöscht`);

            message.channel.send(removed).then(msg => {
                msg.delete(5000)
            });
            break;
    }
}

module.exports.help = {
    name: "blacklist"
}