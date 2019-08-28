const { RichEmbed } = require('discord.js');
const { red, yellow } = require('../json/botconfig.json');
const ms = require('ms');

let error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {
    /**
     * Überprüft und Behandelt
     * Ob ein Channel für das Incedents Embed gegeben ist
     * Ob ein Nutzer angegeben ist
     * Ob ein Grund angegeben ist
     * Ob der Befehl korrekt ausgeführt wird
     * Ob der zu bannende Nutzer selbst nicht mit der Berechtigung ausgestattet ist
     * Ob der bannende Nutzer Selbst die Berechtigung hat
     */

    //Error handling
    let channelError = error.channelError('ban');
    let cmdHelp = error.cmdHelp('Gebannt', '!ban <perma | temp> <@mention> <Grund>');
    let userNotFound = error.userNotFound();
    let invalidPermission = error.invalidPermission('bannen');
    let userHasPermisson = error.userHasPermisson('Gebannt');
    let invalidReason = error.invalidReason("Ban");

    /* Funktionalität */
    message.delete();

    //Daten Definition
    let bChannel = message.guild.channels.find(`name`, settings.incedents);
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
    let bReason = args.join(" ").slice(31);

    //Errorhandling
    if (!bChannel) return message.channel.send(channelError);
    if (!args[0] || args[0] == "help") return message.reply(cmdHelp);
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(invalidPermission);
    if (!bUser) return message.channel.send(userNotFound);
    if (bUser.hasPermission("BAN_MEMBERS")) return message.channel.send(userHasPermisson);
    if (!bReason) return message.channel.send(invalidReason);

    switch (args[0]) {
        default:
            message.channel.send(cmdHelp);
            break;
        case "perma":
            // Definiert Embed für den Incedents Channel
            let SbanEmbed = new RichEmbed()
                .setColor(red)
                .addField("Gebannter User", `${bUser} Mit der ID: ${bUser.id}`)
                .addField("Gebannt von", `${message.author}  <@${message.author.id}> Mit der ID: ${message.author.id}`)
                .addField("Gebannt in", message.channel)
                .addField("Bannung Zeit", message.createdAt)
                .addField("Bannungs Grund", bReason);
            bChannel.send(SbanEmbed); // Sendet das embed in den Incedents Channel

            // Definiert das BanEmbed
            let UbanEmbed = new RichEmbed()
                .setColor(red)
                .setTitle('Du wurdest gebannt')
                .addField("Du wurdest gebannt von", `${message.author} Mit der ID: ${message.author.id}`)
                .addField("Im Channel", message.channel)
                .addField("Uhrzeit", message.createdAt)
                .addField("Mit dem Grund", bReason);
            bUser.send(UbanEmbed); // Sendet die ban Benachrichtigung

            // Bannt den Nutzer 
            setTimeout(function () {
                message.guild.member(bUser).ban(bReason);
            }, ms('500ms'));
            break;
        case "temp":

            /**
             * converts array of duration codes to seconds
             * supported types: s,m,h,d,w,M,y
             * @param {Array} durarr array of duration codes ['6d','4w']
             * @returns sum of input duration codes in seconds
             */
            function hmstosecs(durarr) {
                let secs = 0
                durarr.forEach(arg => {
                    num = arg.replace(/.$/,'')*1
                    typ = arg.replace(/^\d+/,'')
                    switch (typ) {
                        case 's': secs += 1000*num; break;
                        case 'm': secs += 1000*num*60; break;
                        case 'h': secs += 1000*num*60*60; break;
                        case 'd': secs += 1000*num*60*60*24; break;
                        case 'w': secs += 1000*num*60*60*24*7; break;
                        case 'M': secs += 1000*num*60*60*24*30; break;
                        case 'y': secs += 1000*num*60*60*24*365; break;
                    }
                });
                return secs
            }

        // Definiert Embed für den Incedents Channel
            let StbanEmbed = new RichEmbed()
                .setColor(red)
                .addField("Gebannter User", `${bUser} Mit der ID: ${bUser.id}`)
                .addField("Gebannt von", `${message.author} Mit der ID: ${message.author.id}`)
                .addField("Gebannt in", message.channel)
                .addField("Bannung Zeit", message.createdAt)
                .addField("Bannungs Grund", bReason);
            bChannel.send(StbanEmbed); // Sendet das embed in den Incedents Channel

            // Definiert das BanEmbed
            let UtbanEmbed = new RichEmbed()
                .setColor(red)
                .setTitle('Du wurdest gebannt')
                .addField("Du wurdest gebannt von", `${message.author}`)
                .addField("Im Channel", message.channel)
                .addField("Uhrzeit", message.createdAt)
                .addField("Mit dem Grund", bReason);
            bUser.send(UtbanEmbed); // Sendet die ban Benachrichtigung

            // Bannt den Nutzer 
            setTimeout(function () {
                
                console.log(bUser.id);
                console.log(bUser.user.username);
                console.log(message.guild.id);

                console.log(Date.now());
                console.log( hmstosecs([args[2]])*1000);

                console.log(Date.now() + (hmstosecs([args[2]])*1000));
                console.log(bReason);

                server.query('INSERT INTO bans SET ?', {
                    name: bUser.user.username, 
                    uuid: bUser.id, 
                    serverid: message.guild.id,
                    banUntil: Date.now() + hmstosecs([args[2]]), 
                    reason: bReason
                }, (error, results, field) => {
                    message.guild.member(bUser).ban(bReason);
                    if(error) throw error;
                });            
            }, ms('500ms'));

            break;  
    }
}

module.exports.help = {
    name: "ban"
}