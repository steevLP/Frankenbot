const { RichEmbed } = require('discord.js');
const { red, yellow } = require('../json/botconfig.json');

const {randomize, time} = require('watchbotapi');

let error = require('../_essentials/error.js');
let h = require('./history');

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
    let bReason;
    let UUID;

    //Errorhandling
    if (!bChannel) return message.channel.send(channelError);
    if (!args[0] || args[0] == "help") return message.reply(cmdHelp);
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(invalidPermission);
    if (!bUser) return message.channel.send(userNotFound);
    if (bUser.hasPermission("BAN_MEMBERS")) return message.channel.send(userHasPermisson);

    switch (args[0]) {
        default:
            message.channel.send(cmdHelp);
            break;
        case "perma":
            bReason = args.join(" ").slice(27);
            UUID = message.guild.id+"-"+bUser.id+"-"+randomize.single('999999999');

            if (!bReason) return message.channel.send(invalidReason);

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
                .addField("Uhrzeit", message.createdAt)
                .addField("Mit dem Grund", bReason);
            bUser.send(UbanEmbed); // Sendet die ban Benachrichtigung

            // Bannt den Nutzer 
            setTimeout(function () {
                message.guild.member(bUser).ban(bReason);

                server.query('INSERT INTO bans SET ?', {
                    serverid: message.guild.id,
                    uuid: bUser.id, 
                    duration: 'infinite',
                    punid: UUID,
                    state: 'handled',
                    channel: message.channel,
                    operator: message.author.username,
                    username: bUser.user.username, 
                    reason: bReason
                }, (error, results, field) => {
                    message.guild.member(bUser).ban(bReason);
                    if(error) throw error;
                });    
                h.insert(server, [message.guild.id, bUser.id, UUID, 'Perma Ban', bReason]);        
            }, 500);
            break;
        case "temp":
            bReason = args.join(" ").slice(31);
            if (!bReason) return message.channel.send(invalidReason);

        // Definiert Embed für den Incedents Channel
            let StbanEmbed = new RichEmbed()
                .setColor(red)
                .addField("Gebannter User", `${bUser} Mit der ID: ${bUser.id}`)
                .addField("Gebannt von", `${message.author} Mit der ID: ${message.author.id}`)
                .addField("Gebannt in", message.channel)
                .addField("Bannung Zeit", message.createdAt)
                .addField("Ban Zeit", time.convertToString([args[2]]))
                .addField("Bannungs Grund", bReason);
            bChannel.send(StbanEmbed); // Sendet das embed in den Incedents Channel

            // Definiert das BanEmbed
            let UtbanEmbed = new RichEmbed()
                .setColor(red)
                .setTitle('Du wurdest temporär gebannt')
                .addField("Du wurdest gebannt von", message.author)
                .addField("Uhrzeit", message.createdAt)
                .addField("Ban Zeit", time.convertToString([args[2]]))
                .addField("Mit dem Grund", bReason);
            bUser.send(UtbanEmbed); // Sendet die ban Benachrichtigung

            // Bannt den Nutzer 
            setTimeout(function () {
                
                UUID = message.guild.id+"-"+bUser.id+"-"+randomize.single('999999999');

                server.query('INSERT INTO bans SET ?', {
                    serverid: message.guild.id,
                    uuid: bUser.id, 
                    duration: Date.now() + time.convertToMS([args[2]]),
                    punid: UUID,
                    channel: message.channel,
                    operator: message.author.username,
                    username: bUser.user.username, 
                    reason: bReason
                }, (error, results, field) => {
                    message.guild.member(bUser).ban(bReason);
                    if(error) throw error;
                });    
                h.insert(server, [message.guild.id, bUser.id, UUID, 'Temp Ban (' + time.convertToString([args[2]]) + ')', bReason]);        
            }, 1000);

            break;  
    }
}

module.exports.help = {
    name: "ban"
}