const Discord = require("discord.js");
const botconfig = require('../json/botconfig.json');
const watchbot = require('watchbotapi');
const fs = require("fs");
const green = botconfig.green;
const blue = botconfig.blue;

module.exports.run = async (bot, message, args, server, settings) => {
    let permChannel = message.guild.channels.find(`name`, settings.spam);
    message.delete();

    if(message.channel == permChannel){

        server.query(`SELECT * FROM stats WHERE serverid='${message.guild.id}' ORDER BY level DESC LIMIT 10`, (error, results, field) => {
            if(error) throw error;
            let statsEmbed = new Discord.RichEmbed()
                .setColor(green)
                .setTitle("TOP TEN")

                for(let i = 0; i < results.length; i++){
                    statsEmbed.addField((i+1)+" Platz", `${results[i].username} **Level:** ${results[i].level} **XP:** ${results[i].xp} **Msgs:** ${results[i].msgs}`)
                }

                statsEmbed.setFooter(`Die ganze Liste kann auf [LINK] gefunden werden`);
    


            permChannel.send(statsEmbed);
        });

    }else{
        message.channel.send(`Der Befehl ist nur in ${permChannel} erlaubt`)
    }
}

module.exports.help = {
    name: "rank"
}