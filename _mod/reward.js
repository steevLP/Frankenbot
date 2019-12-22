const {file, randomize} = require('watchbotapi');
const {RichEmbed} = require('discord.js');
const ms = require('ms');
const {red, yellow, green} = require('../json/botconfig.json');

let error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {

    let invalidPermission = error.invalidPermission();
    
    let reward = file.import('./json/rewards.json');
    //Permission Check
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(invalidPermission);    
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
            if(!args[0]) return message.channel.send("Bitte Gib eine Aktion an");
            if(!args[1]) return message.channel.send("Bitte Gib ein Level an");
            if(isNaN(args[1])) return message.channel.send("Level muss eine Zahl sein");
            if(!args[2]) return message.channel.send("Bitte Gib einen Rang zum vergeben an");
            server.query({
                sql: 'SELECT * FROM rewards WHERE serverid= ? AND level= ?',
                timeout: 10000,
                values: [message.guild.id,args[1]]
            },(error, results, fields) => {
                if(results.length > 0) return message.channel.send("Level bereits vergeben");
                server.query('INSERT INTO rewards SET ?',{
                    serverid: message.guild.id,
                    level: args[1],
                    rank: args.join(" ").slice(5+(args[1].length))
                }, (error, results, fields) => {
                    if(error) throw error;
                })

                let added = new RichEmbed()
                    .setColor(green)
                    .addField("Erfolgreich!", `Der Reward wurde erstellt`);

                message.channel.send(added).then(msg => {
                    message.delete(1000);
                });
            });
            break;
        case 'list':
            message.delete();
            server.query({
                sql: 'SELECT * FROM rewards WHERE serverid= ?',
                timeout: 10000,
                values: [message.guild.id]
            },(error, results, fields) => {
                if(typeof(results.length) === undefined) return;
                let blacklistEmbed = new RichEmbed()
                    .setColor(green)
                    .setTitle(message.guild.name + ' Reward Liste')
                    if(results.length == 0) blacklistEmbed.addField("Huch :/", "Hier sind ja noch keine Rewards", true);
                for(let i = 0; i < results.length; i++){
                    blacklistEmbed.addField(results[i].level, results[i].rank, true);

                }
                message.channel.send(blacklistEmbed).then(msg => {
                    msg.delete(5000)
                });
            });

            break;
        case 'remove':
            message.delete();
            server.query({
                sql: 'SELECT * FROM rewards WHERE serverid= ? AND level= ?',
                timeout: 10000,
                values: [message.guild.id, args[1]]
            },(error, resuls, fields) => {
                if(error) throw error;
                server.query({
                    sql: 'DELETE FROM rewards WHERE serverid= ? AND level= ?',
                    timeout: 10000,
                    values: [message.guild.id, args[1]]
                }, (error, resuls, fields) => {
                    if(error) throw error;
                })
            })

            let removed = new RichEmbed()
                .setColor(green)
                .addField("Erfolgreich!", `Der Reward wurde gelöscht`);

            message.channel.send(removed).then(msg => {
                msg.delete(5000)
            });
            break;
    }
}

module.exports.help = {
    name: "reward"
}