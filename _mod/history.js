const { RichEmbed } = require('discord.js');
const { red, yellow } = require('../json/botconfig.json');

const {randomize, time} = require('watchbotapi');

let error = require('../_essentials/error.js');

module.exports = {
    'insert': function (server, attr){
        server.query(`INSERT INTO history SET ?`, { 
                serverid: attr[0],
                uuid: attr[1],
                punishment: attr[3],
                punid: attr[2],
                reason: attr[4]
            },(error, results, fields) => {
            if(error) throw error;
        });
    }
}

module.exports.run = async (bot, message, args, server, settings) => {
    message.delete();
    let invalidPermission = error.invalidPermission();
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(invalidPermission);

    let hUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!hUser){return message.channel.send('Ein User muss angegeben werden')}
    server.query({
        sql: 'SELECT * FROM history WHERE serverid= ? AND uuid= ?',
        timeout: 10000,
        values: [message.guild.id, hUser.id]
    }, (error, results, fields) => {
        let historyEmbed = new RichEmbed()
        .setTitle(`${hUser.user.username}'s History`)
        .setColor(yellow)
        
        for(let i = 0; i < results.length; i++){
            historyEmbed.addField("PunID", results[i].punid)
            historyEmbed.addField("Event", results[i].punishment, true)
            historyEmbed.addField("Grund", results[i].reason, true)
        }
        message.author.send(historyEmbed);
    })
}

module.exports.help = {
    name: "history"
}