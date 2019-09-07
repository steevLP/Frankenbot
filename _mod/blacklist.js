const { file } = require('watchbotapi');
const { RichEmbed } = require('discord.js');
const { red, green } = require('../json/botconfig.json');
const error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {

    let invalidPermission = error.invalidPermission('Blacklisten');
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(invalidPermission);

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
            server.query('INSERT INTO blacklist SET ?',{
                serverid: message.guild.id,
                word: args[1]
            }, (error, results, fields) => {
                if(error) throw error;
            })

            let added = new RichEmbed()
                .setColor(green)
                .addField("Erfolgreich!", `__**${args[1]}**__ wurde in der Blacklist gespeichert und wird abjetzt gesperrt`);

            message.channel.send(added).then(msg => {
                message.delete(1000);
            });
            break;
        case 'list':
            message.delete();
            server.query({
                sql: 'SELECT * FROM blacklist WHERE serverid= ?',
                timeout: 10000,
                values: [message.guild.id]
            },(error, results, fields) => {
                if(typeof(results.length) === undefined) return;
                if(results.length <= 0) return; 
                let blacklistEmbed = new RichEmbed()
                    .setColor(green)
                    .setTitle(message.guild.name + ' Blacklist Wörter')
                for(let i = 0; i < results.length; i++){
                    blacklistEmbed.addField(results[i].word, 'gesperrt', true);

                }
                message.channel.send(blacklistEmbed).then(msg => {
                    msg.delete(5000)
                });
            });

            break;
        case 'remove':
            message.delete();
            server.query({
                sql: 'SELECT * FROM blacklist WHERE serverid= ? AND word= ?',
                timeout: 10000,
                values: [message.guild.id, args[1]]
            },(error, resuls, fields) => {
                if(error) throw error;
                server.query({
                    sql: 'DELETE FROM blacklist WHERE serverid= ? AND word= ?',
                    timeout: 10000,
                    values: [message.guild.id, args[1]]
                }, (error, resuls, fields) => {
                    if(error) throw error;
                })
            })

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