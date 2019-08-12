const Discord = require("discord.js");
const botconfig = require('../json/botconfig.json');
const green = botconfig.green;

module.exports.run = async (bot, message, args, server, settings) => {

    let setHelp = new Discord.RichEmbed()
        .setColor(green)
        .setTitle("Frankenbot Settings")
        .addField("spam","channel wo der bot schreiben darf (befehle nicht Nachrichten)")
        .addField("incedents", "Channel wo Ban,Warn,Mute benachrichtigungen hin kommne (User bekommt sperat auch eine)")
        .addField("warnMessage", "Die Nachricht die bei einem warn gesendet wird")
        .addField("antispam", "an = on, aus = off.. Spam Protection gegen duplizierte Nachrichten")
        .addField("prefix", "Das Rufzeichen für Befehle beispiel !");


    message.delete();

    if (!args[0] || args[0] == "help") return message.author.send(setHelp);

    if (!message.member.hasPermission("MANAGE_SERVER")) return message.reply("Dir fehlen die nötigen Rechte!");

    server.query(`SELECT * FROM settings WHERE serverID='${message.guild.id}'`,(error, results, fields) => {
        //If no result gets found
        if(results.length == 0){
            //Create new user stats for that server
            server.query('INSERT INTO settings SET ?', {
                spam: "general",
                incedents: "general",
                admincommands: "general",
                warnMessage: "Du wurdest Verwarnt",
                noSpam: "off",
                serverName: message.guild.name,
                serverID: message.guild.id,
                prefix: botconfig.prefix
            }, (error, results, field) => {
                if(error) throw error;
                console.log(results.insertId);
            });            
        }else{
            


            //Spamchannel Setting
            if (args[0] == "spam") {
                server.query(`UPDATE settings SET spam='${args[1]}'`, (err,results,fields) => {
                    if(err) throw err;

                    let success = new Discord.RichEmbed()
                        .setColor(green)
                        .addField("Erfolgreich", `Der Spamchannel wurde auf ${args[1]} geändert!`);
            
                    message.channel.send(success).then(msg => {
                        msg.delete(5000)
                    });
                });
            }

            //nospam Setting
            if (args[0] == "antispam") {

                let switcher;

                switch(args[1]){
                    case 'on':
                        switcher = 'on'
                        server.query(`UPDATE settings SET nospam='on'`, (error,results,fields) => {if(error) throw error;});
                    break;
                    case 'off':
                        switcher = 'off';
                        server.query(`UPDATE settings SET nospam='off'`, (error,results,fields) => {if(error) throw error;});
                    break;
                    default:
                        message.channel.send('Parameter: `on / off`');
                    break;
                }

                console.log(switcher);
                
                let icon = "✅";

                let success = new Discord.RichEmbed()
                    .setColor(green)
                    .addField("Erfolgreich", `noSpam wurde auf ${switcher} geändert!`);

                message.channel.send(success).then(msg => {
                    msg.delete(5000)
                });
            }

            //Logchannel Setting
            if (args[0] == "incedents") {
                server.query(`UPDATE settings SET incedents='${args[1]}'`, (error,results,fields) => {
                    if(error) throw error;

                    let icon = "✅";

                    let success = new Discord.RichEmbed()
                        .setColor(green)
                        .addField("Erfolgreich", `Der Logchannel wurde auf ${args[1]} geändert!`);

                    message.channel.send(success).then(msg => {
                        msg.delete(5000)
                    });
                });
            }

            //WarnMessage
            if (args[0] == "warnMessage") {
                server.query(`UPDATE settings SET warnMessage='${args[1]}'`, (error,results,fields) => {
                    if(error) throw error;

                    let success = new Discord.RichEmbed()
                        .setColor(green)
                        .addField("Erfolgreich", `Die warnMessage wurde auf ${args[1]} geändert!`);

                    message.channel.send(success).then(msg => {
                        msg.delete(5000)
                    });
                });
            }

            //Music Channel Setting
            if (args[0] == "admincommands") {
                server.query(`UPDATE settings SET admincommands='${args[1]}'`, (error,results,fields) => {
                    if(error) throw error;

                    let success = new Discord.RichEmbed()
                        .setColor(green)
                        .addField("Erfolgreich", `Der admincommands channel wurde auf ${args[1]} geändert!`);

                    message.channel.send(success).then(msg => {
                        msg.delete(5000)
                    });
                });
            }

            //Vorfall Archive setting
            if (args[0] == "serverName") {
                server.query(`UPDATE settings SET serverName='${args[1]}'`, (error,results,fields) => {
                    if(error) throw error;


                    let success = new Discord.RichEmbed()
                        .setColor(green)
                        .addField("Erfolgreich", `Der Vorfallschannel wurde auf ${args[1]} geändert!`);

                    message.channel.send(success).then(msg => {
                        msg.delete(5000)
                    });
                });
            }

            //Prefix Setting
            if (args[0] == "prefix") {
                server.query(`UPDATE settings SET prefix='${args[1]}'`, (error,results,fields) => {
                    if(error) throw error;

                    let success = new Discord.RichEmbed()
                        .setColor(green)
                        .addField("Erfolgreich", `Die Prefix wurde auf ${args[1]} geändert!`);

                    message.channel.send(success).then(msg => {
                        msg.delete(5000)
                    });
                });
            }

        }
    });
}

module.exports.help = {
    name: "settings"
}