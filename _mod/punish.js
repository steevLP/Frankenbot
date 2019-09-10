const { version } = require('watchbotapi');
const { RichEmbed } = require('discord.js');
const { red, green } = require('../json/botconfig.json');
const { file } = require('watchbotapi');

let p;

module.exports.run = async (bot, message, args, server, settings) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(invalidPermission);
    message.delete();

    //error messaging
    let notanumber = new RichEmbed()
        .setColor(red)
        .addField("Der Warn Name muss eine Zahl sein", "!punish <add | remove | edit> <Zahl> <Option> <Zeit(Wenn nötig)>");

    if (args[0] === "add") {

        switch (args[2]) {
            case 'ban': p = ''; break;
            case 'mute': p = ''; break;
            case 'kick': p = ''; break;
            case 'tempban': p = args[3]; break;
            case 'tempmute': p = args[3]; break;
        }


        if (isNaN(args[1])) return message.channel.send(notanumber);
        //Neue Strafe hinzufügen
        let added = new RichEmbed()
            .setColor(green)
            .addField("Erfolgreich", "Die definiert strafe wurde Hinzugefügt");

            server.query("SELECT * FROM punish WHERE serverid= ? AND warnamt= ?",[message.guild.id, args[1]], (error, results, fields) => {
                if(error) throw error;
                if(results.length <= 0){
                    server.query('INSERT INTO punish SET ?',{
                        warnamt: args[1],
                        serverid: message.guild.id,
                        punishment: args[2],
                        length: p
                    },(error, results, fields) => {
                        if(error) throw error;
                        console.log(server.query);
                        message.channel.send(added).then(msg => { msg.delete(1000); });
                    });
                }else{
                    return message.reply('Die Strafe existiert bereits!').then(msg => { msg.delete(1000); });
                }
            })
    }

    if (args[0] === "edit") {

        let edited = new RichEmbed()
            .setColor(green)
            .addField("Erfolgreich", "Die definiert strafe wurde Bearbeitet")

        //Bearbeite Strafe

        switch (args[2]) {
            case 'ban': p = ''; break;
            case 'mute': p = ''; break;
            case 'kick': p = ''; break;
            case 'tempban': p = args[3]; break;
            case 'tempmute': p = args[3]; break;
        }

        server.query("SELECT * FROM punish WHERE serverid= ?",[message.guild.id, args[1]], (error, results, fields) => {
            if(error) throw error;
            if(results.length <= 0){
                return message.reply('Die Strafe existiert nicht!').then(msg => { msg.delete(1000); });
            }else{
                server.query({
                    sql: `UPDATE punish SET punishment= ?, length= ? WHERE serverid= ?`,
                    timeout: 10000,
                    values: [args[2], p, message.guild.id]
                },(error, results, fields) => {
                    if(error) throw error;
                    message.channel.send(edited).then(msg => { msg.delete(1000); });
                });
            }
        })
    }

    if (args[0] === "remove") {

        let removed = new RichEmbed()
            .setColor(green)
            .addField("Erfolgreich", "Die definiert strafe wurde gelöscht");

        server.query("SELECT * FROM punish WHERE serverid= ?",[message.guild.id, args[1]], (error, results, fields) => {
            if(error) throw error;
            if(results.length <= 0){
                return message.reply('Die Strafe existiert nicht!').then(msg => { msg.delete(1000); });
            }else{
                server.query({
                    sql: `DELETE FROM punish WHERE warnamt= ? AND serverid= ?`,
                    timeout: 10000,
                    values: [args[1], message.guild.id]
                },(error, results, fields) => {
                    if(error) throw error;
                    message.channel.send(removed).then(msg => { msg.delete(1000); });
                });
            }
        })
    }
}
module.exports.help = {
    name: "punish"
}