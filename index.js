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
[
  { name: "color", value: "#dbbddb" },
  { name: "createEmbed", value: functions.createEmbed },
  { name: "createMessage", value: functions.createMessage },
  { name: "commands", value: new Collection() },
  { name: "aliases", value: new Collection() },
  { name: "responses", value: new Collection() },
  { name: "cachedPrefixs", value: {} },
  { name: "getPrefix", value: functions.getPrefix },
  { name: "getUserFromDb", value: functions.getUserFromDb },
  { name: "db", value: new (require("./classes/db.js"))() },
  { name: "cachedProfiles", value: {} },
  {name: "getAllGuildData", value: functions.getAllGuildData},
  {name: "changeSettings", value: functions.changeSettings}
].map(x => (client[x.name] = x.value));
mongo.connect(config.uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
let db = mongo.connection;
db.once("open", () => console.log("DB connected"));
["command", "event"].map(handler => {
  require(`./handler/${handler}`)(client);
});
client.login(config.token);