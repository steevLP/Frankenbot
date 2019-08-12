const {
    RichEmbed
} = require('discord.js');
const {
    green
} = require('../json/botconfig.json');
module.exports.run = async (bot, message, args, server, settings) => {
    message.delete();

    let helpEmbed = new RichEmbed()
        .setColor(green)
        .setTitle('Frankenbot (BETA) Hilfe')
        .addField('Ban Befehl', "!ban <perma | temp> <@user> <Grund>")
        .addField('Reward Befehl' , "!reward <add | remove | edit> <Level> <Belohnung>")
        .addField('Kick Befehl', "!kick <@user> <Grund>")
        .addField('Warn Befehl', "!warn <@user | check | temp | remove> <Grund> <Bei tempwarn (Länge)>")
        .addField("Mute Befehl", "!mute <@user | check> <Grund> <Länge>")
        .addField("Punish Befehl", "!punish <add | remove | edit> <Zahl> <Option> <Zeit(Wenn nötig)>")
        .addField("Blacklist Befehl", "!blacklist <add | remove | list> <Wort>")
        .addField("Settings Befehl", "!settings <option> <Einstellung>");

    message.author.send(helpEmbed);
}

module.exports.help = {
    name: "help"
}