require("module-alias/register");
const {
  Client,
  MessageAttachment,
  Collection,
  MessageEmbed
} = require("discord.js");
const client = new Client({
  fetchAllMembers: true,
  partials: ["MESSAGE", "USER", "REACTION"],
  restTimeOffset: 60,
  ws: {
    intents: 32767
  }
});

let config = require("./config.json");
let functions = require("./functions/client.js");
let mongo = require("mongoose");
const { tree } = require("./utils/cmd.js");
[
  { name: "color", value: "#dbbddb" },
  { name: "createEmbed", value: functions.createEmbed },
  { name: "createMessage", value: functions.createMessage },
  { name: "xpCooldowns", value: new Set() },
  { name: "getPrefix", value: functions.getPrefix },
  { name: "getUserFromDb", value: functions.getUserFromDb },
  { name: "db", value: new (require("./classes/db.js"))() },
  { name: "getAllGuildData", value: functions.getAllGuildData },
  { name: "changeSettings", value: functions.changeSettings },
  { name: "cachedPrefixs", value: {} },
  {
    name: "commandCount",
    value: functions.commandCount
  },
  { name: "owners", value: ["606279329844035594"] }
].map(x => (client[x.name] = x.value));
mongo.connect(config.uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
["economy", "leveling", "general", "config", "cards", "owner"].map(dir => {
  console.log(`[Command] loading ${dir}`);
  require(`./commands/${dir}.js`);
});
let db = mongo.connection;
db.once("open", () => console.log("DB connected"));
["event"].map(handler => {
  require(`./handler/${handler}`)(client);
});
client.login(config.token);
module.exports = client;
