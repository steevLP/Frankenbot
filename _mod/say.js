const {RichEmbed} = require('discord.js');
const {green} = require('../json/botconfig.json');
module.exports.run = async (bot, message, args) => {
    message.delete();
    if(!message.member.hasPermissions("KICK_MEMBERS")) return;
    let botmessage = args.join(" ");
    let bIcon = bot.user.displayAvatarURL;
    let embed = new RichEmbed()
    .setColor(green)
    .setThumbnail(bIcon)
    .addField('Watchbot sagt', botmessage);

    message.channel.send(embed);
}

module.exports.help = {
    name: "say"
}