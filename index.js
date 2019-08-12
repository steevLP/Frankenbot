const Discord = require("discord.js");
const botconfig = require('./json/botconfig.json');
const token = botconfig.token;
const { file, randomize } = require('watchbotapi');
const bot = new Discord.Client({ disableEveryone: true });
const fs = require('fs');
const sql = require('mysql');
const db = require('./json/sql.json');

bot.commands = new Discord.Collection();
var server = sql.createConnection({
    host     : db.host,
    user     : db.user,
    password : db.pw,
    database : db.name
});
//let users = require('./json/users.json');

server.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

//File Import
fs.readdir('./_mod/', (err, files) => {
    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() == "js")
    if (jsfile.length <= 0) {
        console.log("[sys-cmd]: Befehle konnten nicht gefunden werden");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./_mod/${f}`);
        console.log(`[sys-cmd]: ${f} [loaded]`);
        bot.commands.set(props.help.name, props);
    });
});

fs.readdir('./_user/', (err, files) => {
    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() == "js")
    if (jsfile.length <= 0) {
        console.log("[sys-cmd]: Befehle konnten nicht gefunden werden");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./_user/${f}`);
        console.log(`[sys-cmd]: ${f} [loaded]`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("ready", async () => {
    console.log(`[sys-dsc]: ${bot.user.username} ist Fehler frei hochgefahren und nun Online!`);
    console.log(`[sys-dsc]: ${bot.user.username} Ist auf ${bot.guilds.size} Servern Online!`);
    bot.user.setActivity("!help", { type: "PLAYING" });

    setInterval(()=>{
        bot.guilds.forEach(guild => {
            console.log(Date.now());
            console.log(guild.id);
            server.query(`SELECT * FROM bans WHERE banUntil <= '${Date.now()}' AND serverid = '${guild.id}'`, (error, results, fields) => {
                if(results.length > 0){
                    console.log(Date.now());
                    guild.unban(results[0].uuid);
                    server.query(`DELETE FROM bans WHERE serverid = '${guild.id}' AND uuid = '${results[0].uuid}'`, (error, results, fields) => {
                        if(error) throw error;
                    });
                }else{
                    return;
                }
            });
        });
    },1000);
});

//Spam filter
bot.on('message', async message => {
    if (message.author.bot) return;
    //blacklist
    let blacklist = file.import('./json/blacklist.json');

    //Blacklist Erstellung
    if (!blacklist[message.guild.id]) {
        blacklist[message.guild.id] = {
            list: []
        };
        file.save('./json/blacklist.json', blacklist);
        return;
    }

    //Blacklist Funktion
    let spamfilter = blacklist[message.guild.id].list;
    spamfilter.forEach((item) => {
        if (message.content.startsWith("!blacklist")) return;
        if (message.author.bot) return;
        if (message.content.toLowerCase().includes(item)) {

            message.delete();
            message.reply(`ein wort in deiner nachricht ist auf diesem discord gesperrt!`).then(msg => {
                msg.delete(5000);
            });
        }
    });
    
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    setTimeout((guild) => {
        server.query(`SELECT * FROM stats'`,(error, results, fields) => {
            //console.log(message.guild.members);
        });
    }, 100);

    //Settings Creation on handling of the nospam filter
    server.query(`SELECT * FROM settings WHERE serverid='${message.guild.id}'`,(error, results, fields) => {

        //If no result gets found
        if(typeof(results.length) == undefined){
            //Create new Settings for that server
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
            });            
        }else{
            //Antispam
            if (results[0].nospam === "on") {

                let msg = message;
                if (msg.content) {
                    let filter = m => m.author.id === msg.author.id;

                    message.channel.awaitMessages(filter, {
                            max: 1
                        })
                        .then(msg2 => {
                            if (msg.content === msg2.first().content && msg.author.id === msg2.first().author.id) {
                                message.delete();
                                message.reply('Hey bitte Spam nicht so sehr!').then(msg => { msg.delete(1000);});
                            }
                        }).catch(collected => console.log(collected.size));
                }
            }
        }
    });

    //User Stats

    //Select everything from stats
    server.query(`SELECT * FROM stats WHERE serverid='${message.guild.id}' AND uuid='${message.author.id}'`, (error, results, field) => {
        if(error) throw error;

        //If no result gets found
        if(results.length == 0){
            //Create the new Settings for that Server
            server.query('INSERT INTO stats SET ?', {
                warns: 0,
                level: 1,
                xp: 0,
                msgs:1,
                username: message.author.username,
                serverid: message.guild.id,
                uuid: message.author.id
            }, (error, results, fields) => {
                if(error) throw error;
            });            
        }else{

            //Leveling stats
            /**
             * @param {int} xpAdd A Randomized amount of xp that get added to the users account.
             * @param {int} curxp The Users current Xp amount.
             * @param {int} msgs The users current amount of written msgs from start of the users stats recording using frankenbot.
             * @param {int} curlvl The Users current Level.
             * @param {int} nxtLvl The amount of XP what is needed to reach next level.
             * Updated Stats
             * @param {int} newXP the updated amount of XP.
             * @param {int}newMsgs the updated amount of msgs <- gets fired on each message the user emits.
             */

            //Data Definition
            let xpAdd = randomize.multiple(7, 1);
            let curxp = results[0].xp;          
            let msgs = results[0].msgs;
            let curlvl = results[0].level;
            let nxtLvl = results[0].level * (curlvl * 300);

            //New Updated Stats
            var newXP = curxp + xpAdd;
            var newMsgs = msgs + 1;

            //Update MSGS And XP
            server.query(`UPDATE stats set xp=${newXP}, msgs=${newMsgs} WHERE serverid=${message.guild.id} AND uuid='${message.author.id}'`,(error, results, fields) => {
                if(error) throw error;
            });

            if (nxtLvl <= curxp) {
                let newlvl = curlvl + 1;

                //Update Level
                server.query(`UPDATE stats SET level=${newlvl} WHERE serverid=${message.guild.id} AND uuid='${message.author.id}'`,(error, results, fields) => {
                    if(error) throw error;
            
                    //Build and Send Level UP Embed
                    let lvlup = new Discord.RichEmbed()
                        .setTitle("Level UP ➕ ")
                        .setColor(botconfig.green)
                        .addField("Neues Level Erreicht!!", `Dein neues Level ist nun: ${newlvl}`);
    
                    message.channel.send(lvlup).then(msg => {
                        msg.delete(5000)
                    });

                    let reward = file.import('./json/rewards.json');
                    //rewards Erstellung
                    if (!reward[message.guild.id]) {
                        reward[message.guild.id] = {
                            reward: []
                        };
                        file.save('./json/rewards.json', reward);
                        return;
                    }
            
                    //rewards Funktion
                    let u = message.member;
            
                    if (reward[message.guild.id].hasOwnProperty(curlvl)) {
                        let role = message.guild.roles.find(`name`, reward[message.guild.id][curlvl]);
                        u.addRole(role.id);
                    };
                });
            }
        }
    });

    server.query(`SELECT * FROM settings WHERE serverid='${message.guild.id}'`,(error, results, fields) => {

        //Command Handler & Message Handler
        let prefix = results[0].prefix;

        if (!message.content.startsWith(prefix)) return;

        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);
        let commandfile = bot.commands.get(cmd.slice(prefix.length));
        let settings = results[0];

        if (commandfile) commandfile.run(bot, message, args, server, settings);
    });

});
bot.login(token);