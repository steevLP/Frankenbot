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

        server.query(`SELECT * FROM stats WHERE serverid='${message.guild.id}' AND uuid='${message.author.id}'`, (error, results, field) => {

            let curxp = results[0].xp;
            let curlvl = results[0].level;
            let msgs = results[0].msgs;
            let nxtlvlxp = curlvl * (curlvl * 300);
            let difference = nxtlvlxp - curxp;

            let c = curxp * 100 / nxtlvlxp;
            //let ac = Math.round(c);
            let tc = Math.floor(c);
            function pb(tc){
                let pb = '';
                switch(tc){
                    case '10':
                        pb = '■';
                    break;
                    case '20':
                        pb = '■ ■';
                    break;
                    case '30':
                        pb = '■ ■ ■';
                    break;
                    case '40':
                        pb = '■ ■ ■ ■';
                    break;
                    case '50':
                        pb = '■ ■ ■ ■ ■';
                    break;
                    case '60':
                        pb = '■ ■ ■ ■ ■ ■';
                    break;
                    case '70':
                        pb = '■ ■ ■ ■ ■ ■ ■';
                    break;
                    case '80':
                        pb = '■ ■ ■ ■ ■ ■ ■ ■';
                    break;
                    case '90':
                        pb = '■ ■ ■ ■ ■ ■ ■ ■ ■';
                    break;
                    case '100':
                        pb = '■ ■ ■ ■ ■ ■ ■ ■ ■ ■';
                    break;
                }
                return pb;
            }


            let statsEmbed = new Discord.RichEmbed()
                .setColor(green)
                .setTitle(message.author.username+"'s Stats")
                .addField("Level", curlvl, true)
                .addField("Msg's", msgs, true)
                .addField("XP", curxp, true)
                .setFooter(`Fortschritt zum nächsten Level: ${curxp} / ${nxtlvlxp}, ${pb(tc)}`, message.author.displayAvatarURL);
    


            permChannel.send(statsEmbed);
        });

    }else{
        message.channel.send(`Der Befehl ist nur in ${permChannel} erlaubt`)
    }
}

module.exports.help = {
    name: "stats"
}