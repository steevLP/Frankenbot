const {
    RichEmbed
} = require('discord.js');
const {
    red,
    yellow
} = require('../json/botconfig.json');
module.exports = {
    'channelError': function (methode) {
        let embed = new RichEmbed()
            .setColor(red)
            .addField("Fehler! Channel nicht gefunden!", `Der Channel in dem die ${methode} Nachrichten gepostet werden konnte nicht gefunden werden!`);
        return embed;
    },
    'userNotFound': function () {
        let embed = new RichEmbed()
            .setColor(red)
            .addField("Fehler! User konnte nicht gefunden werden", "Der angegebene User konnte nicht gefunden werden oder wurde falsch geschrieben");
        return embed;
    },
    'itemNotFound': function (methode) {
        let embed = new RichEmbed()
            .setColor(red)
            .addField(`Fehler! ${methode} konnte nicht gefunden werden`, `Der angegebene ${methode} konnte nicht gefunden werden oder wurde falsch geschrieben`);
        return embed;
    },
    'userHasPermisson': function (methode) {
        let embed = new RichEmbed()
            .setColor(red)
            .addField(`Fehler! User kann nicht ${methode} werden`, `Ein User mit dieser Permission kann nicht ${methode} werden`);
        return embed;
    },
    'invalidPermission': function (methode) {
        let embed = new RichEmbed()
            .setColor(red)
            .addField(`Fehler! Unzureichende Permission`, `Dir fehlen die nötigen Permissions um ${methode} zu können!`);
        return embed;
    },
    'userHasPermisson': function (methode) {
        let embed = new RichEmbed()
            .setColor(red)
            .addField(`Fehler! User kann nicht ${methode} werden`, `Ein User mit dieser Permission kann nicht ${methode} werden`);
        return embed;
    },
    'invalidReason': function (methode) {
        let embed = new RichEmbed()
            .setColor(red)
            .addField("Fehler! Es muss ein Grund angegeben sein!", `Du musst einen Grund angeben damit du diesen ${methode} gültig absenden kannst!`);
        return embed;
    },
    'cmdHelp': function (methode, cmd) {
        let embed = new RichEmbed()
            .setColor(yellow)
            .addField(`Der ${methode} Befehl`, `Der ${methode} Befehl wird folgendermaßen ausgeführt ${cmd}`);
        return embed;
    },
    'invalidArgument': function(method, argument){
        let embed = new RichEmbed()
            .setColor(red)
            .addField(`Fehler: Argument ${argument} fehl um ${method} ausführen zu können`);
        return embed;
    },
    'argumentToHigh': function(method, argument, maximumSize){
        let embed = new RichEmbed()
            .setColor(red)
            .addField(`Fehler: Die Option ${argument} von ${method} kann nicht über ${maximumSize} sein!`);
        return embed;
    }
}