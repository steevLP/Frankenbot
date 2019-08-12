const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    'dir': function(path){
        fs.readdir(path, (err, files) => {
            console.log("================= Loading moderation =================");
            if (err) console.log(err);
            let jsfile = files.filter(f => f.split(".").pop() == "js")
            if (jsfile.length <= 0) {
                console.log("Befehle konnten nicht gefunden werden");
                return;
            }
        
            jsfile.forEach((f, i) => {
                let props = require(path+f);
                console.log(`${f} loaded!`);
                bot.commands.set(props.help.name, props);
            });
            console.log("======================================================");
        });
    }
}