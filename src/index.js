console.clear();

const { Assistant } = require('./util/classes/Assistant');
const { readdirSync } = require('fs');
const { connect } = require('mongoose');
require('dotenv/config');

const client = new Assistant();

const handlerFiles = readdirSync('./src/handlers/').filter(file => file.endsWith('.js'));
for (const file of handlerFiles) require(`./handlers/${file}`)(client);

const systemFolders = readdirSync('./src/systems/');
for (const folder of systemFolders) {
    const systemFiles = readdirSync(`./src/systems/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of systemFiles) require(`../src/systems/${folder}/${file}`)(client);    
};

client.handleCommands();
client.handleEvents();
client.login(process.env.BOT_TOKEN).then(() => {
    connect(process.env.DATABASE_URL).then(() => console.log('[Database Status]: Connected'));
}).catch(console.error);