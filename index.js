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

server.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

/* ===============
   * File Import *
   =============== */
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

/* ================================
   * First ever running Mechanics *
   ================================ */
bot.on("ready", async () => {
    console.log(`[sys-dsc]: ${bot.user.username} ist Fehler frei hochgefahren und nun Online!`);
    console.log(`[sys-dsc]: ${bot.user.username} Ist auf ${bot.guilds.size} Servern Online!`);
    bot.user.setActivity("!help", { type: "PLAYING" });
 
 /* ======================
    * Unpunish Mechanics *
    ====================== */
    setInterval(()=>{
        bot.guilds.forEach(guild => {
            bot.users.forEach(u => {

             /* ============================
                * Username Update Mechanic *
                ============================ */
                server.query({
                    sql: `SELECT * FROM stats WHERE uuid= ?`,
                    timeout: 10000,
                    values: [u.id, guild.id]
                }, (error, result,fields) => {
                    if(error) throw error;
                    for(let i = 0; i < result.length; i++){
                        if(result[i].username != u.username){
                            server.query({
                                sql: "UPDATE stats set username= ? WHERE serverid= ? AND username= ?",
                                timeout: 10000,
                                values: [u.username, guild.id, result[i].username]
                            }, (error, result, fields) => {
                                if(error) throw error;
                            })
                        }
                    }
                });
            });

            let conv_date = Number(Date.now());
            
            /* =====================
               * Unbaning Mechanic *
               ===================== */
            server.query({
                sql: `SELECT * FROM bans WHERE state = 'active' AND convert(duration, INT) <= ?`,
                timeout: 10000,
                values:[conv_date]
            }, (error, bans, fields) => {
                if(typeof(bans.length) === undefined) return;
                    if(bans.length <= 0) return; 
                    if(guild.id === bans[0].serverid){
                        // Unban Expired Punishments
                        guild.unban(bans[0].uuid).then(user => console.log(`Unbanned ${user} from ${guild}`)).catch(console.error());
                    }

                        // Flag Ban as handled
                        server.query({
                            sql: `UPDATE bans set state = 'handled' WHERE serverid= ? AND uuid= ?`,
                            timeout: 10000,
                            values: [guild.id, bans[0].uuid]
                        }, (error, bUpdate, fields) => {
                            if(error) throw error;
                        });
            });

            /* ========================
               * Unmute Expired mutes *
               ======================== */
            server.query({
                sql: `SELECT * FROM mutes WHERE state = 'active' AND convert(duration, INT) <= ?`,
                timeout: 10000,
                values:[conv_date]
            }, (error, results, fields) => {
                if(typeof(results.length) === undefined){ return; }
                if(results.length <= 0) return;

                    if(guild.id === results[0].serverid){
                        // Find Role and Remove it From User
                        let muteRole = guild.roles.find(`name`, "🔇Muted");
                        guild.member(results[0].uuid).removeRole(muteRole, results[0].reason).then(user => console.log(`Unmuted ${user} from ${guild}`)).catch(console.error());
                    }
                    // Flag Mute as handled
                    server.query({
                        sql: `UPDATE mutes set state = 'handled' WHERE serverid= ? AND uuid= ?`,
                        timeout: 10000,
                        values: [guild.id, results[0].uuid]
                    }, (error, results, fields) => {
                        if(error) throw error;
                    });
            });
        });
    },100);
});




/**
 * =======================
 * Spam Filter Mechanics *
 * =======================
 */
bot.on('message', async message => {
    if (message.author.bot) return;
        server.query({
            sql: 'SELECT * FROM blacklist WHERE serverid= ?',
            timeout: 10000,
            values: [message.guild.id]
        }, (error, results, fields) =>{
            if(error) throw error;
            
            /**
             * ====================
             * Blacklist Mechanic *
             * ====================
             */
            results.forEach(item => {

                // Filter if Message author is a bot or Message is the Blacklist Command
                if (message.content.startsWith("!blacklist")) return;
                if (message.author.bot) return;
                if (message.content.toLowerCase().includes(item.word)) {

                    // If Message Neither is comming from Bots or the Blacklist Command
                    // Remove it
                    message.delete();
                    message.reply(`ein wort in deiner nachricht ist auf diesem discord gesperrt!`).then(msg => {
                        msg.delete(5000);
                    });
                }
            });
        });
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    /**
     * =======================
     * Antispam and Settings *
     * =======================
     */

     // Select All Settings for the Specific Server
    server.query({
        sql: `SELECT * FROM settings WHERE serverid= ?`,
        timeout:10000,
        values:[message.guild.id]
    },(error, results, fields) => {

        // If no result gets found
        if(results.length == 0){

            // Create new Settings for that server
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
                return;
            });            
        }else{
            /**
             * ==========
             * Antispam *
             * ==========
             */       
            if (results[0].noSpam === "on") {
            
                let msg = message;
            
                if (msg.content) {

                    // Stores Message as String
                    let filter = m => m.author.id === msg.author.id;

                    // Compares Next message from that User with the Variable
                    message.channel.awaitMessages(filter, {
                            max: 1
                        }).then(msg2 => {
                            if (msg.content === msg2.first().content && msg.author.id === msg2.first().author.id) {
                                
                                // Are Both the new and the last Message equal Remove the Last one
                                message.delete();

                                //And Notify the User
                                message.reply('Hey bitte Spam nicht so sehr!').then(msg => { msg.delete(1000); });
                            }
                        }).catch(collected => console.log(collected.size));
                }   
            }
        }
    });

    //User Stats

    //Select everything from stats
    server.query({
        sql: `SELECT * FROM stats WHERE serverid= ? AND uuid= ?`,
        timeout: 100000,
        values:[message.guild.id, message.author.id]
    }, (error, results, field) => {
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
            server.query({
                sql: `UPDATE stats set xp= ?, msgs= ? WHERE serverid= ? AND uuid= ?`,
                timeout: 10000,
                values: [newXP,newMsgs,message.guild.id,message.author.id]
            },(error, results, fields) => {
                if(error) throw error;
            });

            if (nxtLvl <= curxp) {
                let newlvl = curlvl + 1;

                //Update Level
                server.query({
                    sql:`UPDATE stats SET level= ? WHERE serverid= ? AND uuid= ?`,
                    timeout: 10000,
                    values: [newlvl, message.guild.id, message.author.id]
                },(error, results, fields) => {
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

    server.query({
        sql: `SELECT * FROM settings WHERE serverid= ?`,
        timeout: 10000,
        values: [message.guild.id]
    },(error, results, fields) => {

        if(results.length == 0){

            return message.channel.send('Einstellungen wurden eingerichtet! \n Bitte versuche es erneut!');

        }else if(results.length > 0){

            //Command Handler & Message Handler
            let prefix = results[0].prefix;

            let current_datetime = new Date()
            let date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();

            if (!message.content.startsWith(prefix)) return;

            let messageArray = message.content.split(" ");
            let cmd = messageArray[0];
            let args = messageArray.slice(1);
            let commandfile = bot.commands.get(cmd.slice(prefix.length));
            let settings = results[0];

            if (commandfile) commandfile.run(bot, message, args, server, settings, date);
        }
    });

});
bot.login(token);