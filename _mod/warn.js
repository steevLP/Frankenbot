const {file, randomize} = require('watchbotapi');
const {RichEmbed} = require('discord.js');
const ms = require('ms');
const {red, yellow} = require('../json/botconfig.json');

let error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {
    
    let invalidPermission = error.invalidPermission();
    let channelError = error.channelError("Warn");
    let userNotFound = error.userNotFound();
    let warnNotFound = error.itemNotFound('warn');
    let invalidReason = error.invalidReason("Warn");
    
    //Permission Check
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(invalidPermission);    

    //Command Check
    if(!args[0] ||args[0] === "help") return message.channel.send(cmdHelp);
    
    message.delete();

    //Data Definition
    let wReason = args.join(" ").slice(22);
    let users = require('../json/users.json');
    let cPunish = file.import('./json/punish.json');
    let wUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
    let wChannel = message.guild.channels.find(`name`, settings.incedents);
    let muterole = message.guild.roles.find(`name`, "🔇Muted");
    
    //Erstelle Stats wenn noch nicht vorhanden und Lädt Aktuelle Warns
    var uuid = message.guild.id+"-"+wUser.id;
    
    //Warn Datenbank Definition
    let wID = file.import('./json/warns.json');
    let wUUID = message.guild.id+"-"+wUser.id+"-"+randomize.single('999999999');

    switch(args[0]){
        default:
            //Fehler Vergabe
            if(!wChannel) return message.channel.send(channelError);
            if(!wUser) return message.reply(userNotFound);
            if(!wReason) return message.channel.send(invalidReason);
            if(wUser.hasPermission('KICK_MEMBERS')) return message.channel.send(userHasPermisson);
            //TODO: Update Warns on Users table
            //Warn Vergabe & Speicherung
            
    //Select the warns option from the specific user
    server.query(`SELECT warns FROM stats WHERE serverid='${message.guild.id}' AND uuid='${wUser.id}'`, (error, results, field) => {
            if(error) throw error;
            
            console.log(results[0]);

            //Update the value
            let warns = results[0].warns;
            let newWarns = warns += 1;
            
            //Insert the updated Value
            server.query(`UPDATE stats SET warns='${newWarns}' WHERE serverid='${message.guild.id}' AND uuid='${wUser.id}'`,(error, results, fields)=>{
                if(error) throw error;
            });
	});
    let wUUID = message.guild.id+"-"+wUser.id+"-"+randomize.single('999999999');

    server.query('INSERT INTO warns SET ?', {
        username: wUser.user.username,
        uuid: wUser.id,
        reason: wReason,
        operator: message.author.username,
        channel: message.channel.name,
        warnID: wUUID,
        serverid: message.guild.id
    }, (error, results, fields) => {
        if(error) throw error;
    }); 
    
            //Warn Messaging
            server.query(`SELECT * FROM settings WHERE serverID=${message.guild.id}`,(error, settings, fields) =>{
                server.query(`SELECT * FROM stats WHERE uuid=${wUser.id}`,(error, stats, fields)=>{
                    
                    console.log(stats[0]);
                    //Warn Embed Server
                    let pEmbedServer = new RichEmbed()
                        .setColor(yellow)
                        .setTitle(`${settings[0].warnMessage}`)
                        .addField("Verwarnter User", wUser.user.username)
                        .addField('Verwarnt von', message.author.username)
                        .addField('Deine WarnID', wUUID)
                        .addField('Grund', wReason)
                        .addField('Deine Anzahl verwarnungen', `${stats[0].warns}`)
                        .setFooter('Sollte die Warn nicht gerechtfertig sein bitte Melde dich mit deiner Warnid im Support');    
                    wUser.send(pEmbedServer).then(err => {
                        if(err) throw err;
                    }); 
                })
            });
        break;
        /*case "temp":  
            let cond = users[uuid].warns;
            let tempTime = cPunish[message.guild.id][cond].length
            //Längen vergabe
            let length = args[2];
                    
            //Fehler Vergabe
            if(!wChannel) return message.channel.send(channelError);
            if(!wUser) return message.reply(userNotFound);
            if(!wReason) return message.channel.send(invalidReason);
            if(wUser.hasPermission('KICK_MEMBERS')) return message.channel.send(userHasPermisson);
        
            wReason = args.join(" ").slice((27 + length.length()));
        
            console.log(wReason);
        
            //Warn Vergabe & Speicherung
            users[uuid].warns +=1;
            file.save('./json/users.json', users);
            
            //Warn Messaging
            
            //Warn Embed Server
            let embedServer = new RichEmbed()
                .setColor(yellow)
                .setTitle(`${settings[message.guild.id].warnMessage}`)
                .addField("Verwarnter User", wUser.user.username)
                .addField('Verwarnt von', message.author.username)
                .addField('Deine WarnID', wUUID)
                .addField('Grund', wReason)
                .setFooter('Sollte die Warn nicht gerechtfertig sein, bitte melde dich mit deiner Warnid im Support');    
            message.channel.send(embedServer).then(err => {
                if(err) throw err;
            }); 
            
            
            setTimeout(function(){
                users[uuid].warns -=1;
                file.save('./json/users.json', users);               
            }, ms(tempTime));
        break;*/
        case "remove":
            
        break;
        case "check":
            //Daten Definition
            let warns = file.import('./json/warns.json');
            let id = args[1];
                
            //Fehler Vergabe
            if(!wChannel) return message.channel.send(channelError);
            if(!warns[id]) return message.channel.send(warnNotFound);
        
            //Warn Anzeige
            let checkEmbed = new RichEmbed()
                .setColor(green)
                .setTitle(warns[id].username)
                .addField("Name", warns[id].username)
                .addField("UserID", warns[id].userID)
                .addField("Warn Grund", warns[id].reason)
                .addField("Verwarnt von", warns[id].warnedBy)
                .addField("Verwant in Channel", warns[id].channel)
                .addField("Aktuelle Anzan Warns", warns[id].warns);
            
            //Absendunge
            wChannel.send(checkEmbed).then(err =>{if(err) throw err;});
        break;
    }

    /**
      * Warn Embeds
      * Warn Vergabe
      * Warn Benachrichtigung
      * Custom Warn Punischment   
    setTimeout(function(){
        let condition = users[uuid].warns;
        let warns;
        if(cPunish[message.guild.id].hasOwnProperty(condition)){warns = cPunish[message.guild.id][condition].punishment};
        switch(warns){
            case "tempban":                 
                let tempbanEmbed = new RichEmbed()
                    .setTitle("Du wurdest Temporär gebannt!")
                    .addField("Name", wUser.user.username)
                    .addField("Chanenl", message.channel)
                    .addField("Von", message.author.username)
                    .addField("Grund", wReason)
                    .addField("zeit", cPunish[message.guild.id][condition].length);
                    
                    wUser.send(tempbanEmbed);

                setTimeout(function(){
                    wUser.ban(wReason);
                }, ms("300ms"));

                setTimeout(function(){
                    message.guild.unban(wUser,wReason);
                }, ms(cPunish[message.guild.id][condition].length));
            break;
            case 'ban':
                message.channel.send(uBanned).then(message.guild.ban(wUser,wReason));

                setTimeout(function(){
                    message.guild.ban(wUser,wReason);
                }, ms(cPunish[message.guild.id][condition].length));
            break;
            case "mute":
                let uMuted = new RichEmbed()
                .setColor(red)
                .addField("Du wurdest gemuted!", "Du wurdest vom Warn System gemutet! Dies liegt daran das du die Regeln nicht bevolgt hast");
            
                wUser.addRole(muterole).then(wUser.send(uMuted));
            break;
            case "kick":
                message.guild.kick(wUser, wReason);
            break;
            case "tempmute":
            let uTempMuted = new RichEmbed()
                .setColor(red)
                .addField("Du wurdest temorär gemuted!", "Du wurdest vom Warn System gemutet! Dies liegt daran das du die Regeln nicht bevolgt hast")
                .addField("Der Mute geht", `${cPunish[message.guild.id][condition].length}`);
            
                wUser.addRole(muterole)
                    .then(wUser.send(uTempMuted));
                
                    setTimeout(function(){
                        let unmuted = new RichEmbed()
                            .addField("Du wurdest Entmuted", "Bitte halte dich ab jetzt an die Regeln");

                        wUser.removeRole(muterole).then(wUser.send(unmuted));
                    }, ms(cPunish[message.guild.id][condition].length));
            break;
        }
    },ms('500ms'));*/
}

module.exports.help = {
    name: "warn"
}
