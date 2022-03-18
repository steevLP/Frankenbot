# Frankenbot
## Frankenbot is
Frankenbot is a bot, made for beeing that one Bot a Discord Server needs. Nothing more.. Realy!
Frankenbot is a fully customisable bot means all power belongs to the Server Owner.

## Frankenbot is not
unnecessary! The Bot has lot's of usefull Features implemented

## Features
1. User XP and Level tracking
2. Level based Role Assignment (Rewards)
3. Basic Message Filter
4. Both permanent and temporary Kick, Ban and Mute Functions
5. A Settings Command to controll the entire Bot from inside the Server
6. A top Ten list Command for Users to compare server Activity
7. A History for Moderators to track a users Punishments
and a lot more

## how to run it
configure your database server according the filds inside of `json/botconfig.json`
add a .env file to set your bots application token you can obtain from the discord developer page
create your .env with this format `TOKEN=<token>`
configure `json/sql.json` that it points to your database on your mysql server and import bot.sql
install nodejs dependencies `npm install`
start the bot itself `node index`
