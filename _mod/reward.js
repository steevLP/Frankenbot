const {file, randomize} = require('watchbotapi');
const {RichEmbed} = require('discord.js');
const ms = require('ms');
const {red, yellow} = require('../json/botconfig.json');

let error = require('../_essentials/error.js');

module.exports.run = async (bot, message, args, server, settings) => {

    let invalidPermission = error.invalidPermission();
    
    let reward = file.import('./json/rewards.json');
    //Permission Check
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(invalidPermission);    
    message.delete();

    if(args[0] === 'add'){
        server.query({
            sql:"SELECT * FROM rewards WHERE serverid= ?",
            timeout: 10000,
            values: [message.guild.id]
        })
    }else if(args[0] === 'edit'){
        if(!reward[message.guild.id].args[1]){
            return message.channel.send('Unbekannter Reward');
        }else{
            reward[message.guild.id][args[1]] = args[2];
        }
    }else if(args[0] === 'list'){
        function display(){
            for(i = 0; i <= reward[message.guild.id].length; i++){
                if (reward[message.guild.id].hasOwnProperty(i)) {
                    return `.addField(${reward[message.guild.id][i]}, ${reward[message.guild.id][i].rank})`;
                }
            }
        }
        
        let embed = RichEmbed()
        .setColor(green)
        display();
    }
}

module.exports.help = {
    name: "reward"
}