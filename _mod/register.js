const {file, randomize} = require('watchbotapi');
const {RichEmbed} = require('discord.js');
const ms = require('ms');
const {red, yellow, green} = require('../json/botconfig.json');
const error = require('../_essentials/error');
var sha1 = require('sha1');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

//TODO: VERYFY USER HAVING RIGHT PERMISSION AND IS NOT ALLREADY REGISTERED AND NOT ALLREADY ASIGNED THAT SERVER
//TODO: GIVE OWNER SUPERADMIN PRIVELIGES MEANS ACCOUNT MANAGEMENT
module.exports.run = async (bot, message, args, server, settings) => {
    if(!message.member.hasPermissions('MANAGE_GUILD')) return message.channel.send(error.invalidPermission('Registrieren'));
    switch(args[0]){
        case 'new':
            // Creates Password Hash
            let pw = makeid(16);
            console.log(pw);

            server.query(`SELECT * FROM user WHERE uuid=${message.author.id}`, (error, results,fields) => {
                console.log(results.length);
                console.log(results);
                if(results.length <= 0){

                    //Create the new Settings for that Server
                    server.query('INSERT INTO user SET ?', {
                        username: message.member.user.tag,
                        password: sha1(makeid(20)),
                        uuid: message.author.id
                    }, (error, results, fields) => {
                        if(error) throw error;
                    });

                    //Create the new Settings for that Server
                    server.query('INSERT INTO server SET ?', {
                        serverid: message.guild.id,
                        user: message.author.id
                    }, (error, results, fields) => {
                        if(error) throw error;
                    });
                }else{
                    message.reply("Du bist schon Registriert");
                }
            })
        break;
        case 'existing':
            server.query(`SELECT * FROM user WHERE uuid=${message.author.id}`, (error, res,fields) => {
                if(res.length > 0){
                    // Validates that the accout not yet has been linked
                    server.query(`SELECT * FROM server WHERE user=${message.author.id} AND serverid=${message.guild.id}`, (error, results,fields) => {
                        if(results.length <= 0){

                            //Create the new Settings for that Server
                            server.query('INSERT INTO server SET ?', {
                                serverid: message.guild.id,
                                user: message.author.id
                            }, (error, results, fields) => {
                                if(error) throw error;
                            });
                        }else{
                            message.reply("Du bist schon Registriert");
                        }
                    });
                }else{
                    message.reply("Du solltest dir einen Account erstellen bevor du einen server registrierst");
                }
            });
        break;
        case 'help':
        break;
    }
}

module.exports.help = {
    name: "register"
}