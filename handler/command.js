const { readdirSync } = require("fs");

module.exports = client => {
  const load = dirs => {
    const commands = readdirSync(`./commands/${dirs}/`).filter(d =>
      d.endsWith(".js")
    );
    for (let file of commands) {
      let pull = require(`../commands/${dirs}/${file}`);
      console.log(`Loading ${pull.help.name} [Command]`);
      client.commands.set(pull.help.name, pull);
      if (pull.help.aliases)
        pull.help.aliases.map(a => client.aliases.set(a, pull.help.name));
    }
  };
  ["config", "general", "economy", "cards"].map(x => load(x));
};
