const ms = require('ms');
const error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {
    let invalidPermission = error.invalidPermission('Clearen');
    message.delete();
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(invalidPermission);
    let toRemove = parseInt(args[0]);

    if(args[0] > 200) return message.channel.send(error.argumentToHigh('clear', 'Anzahl','200'));

    setTimeout(function () {
        message.channel.fetchMessages({
                limit: toRemove
            })
            .then(messages => message.channel.bulkDelete(messages))
            .then(message.channel.send(`Ich habe ${toRemove} Nachrichten gelöscht!`)
                .then(msg => {
                    msg.delete(1000);
                })
            );
    }, ms("500ms"));
}

module.exports.help = { name: "clear"; }