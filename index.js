const { Client, Collection } = require("discord.js");
const {
    prefix,
    where,
    botActivityStatus,
    botActivityType,
    botStatus
} = require("./config");
const commandhandler = require("./handlers/commandHandler");
const eventhandler = require("./handlers/EventHandler");
require("dotenv").config();
const SQLite = require("better-sqlite3");
const db = new SQLite("./db.sqlite", { verbose: console.log });

const client = new Client({
    disableEveryone: true,
    presence: {
        activity: { name: botActivityStatus, type: botActivityType },
        status: botStatus
    }
});

client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Map();

const load = async() => {
    await commandhandler.run(client);
    await eventhandler.run(client);
    client.prefix = prefix;
    client.where = where;
    client.db = db;
};

load();

client.login(process.env.TOKEN);