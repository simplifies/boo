module.exports = async (client, message, context) => {
  let Discord = require("discord.js");
  try {
    function getPermName(bitfield = 0) {
      for (let key in Discord.Permissions.FLAGS)
        if (Discord.Permissions.FLAGS[key] == bitfield) return key;
      return null;
    }
    if (message.author.bot || message.channel.type === "dm") return;
    let prefix = await client.getPrefix({ client }, message.guild.id);
    let args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix)) return;
    let commandfile =
      client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    let ctx = {
      client,
      message,
      channel: message.channel,
      guild: message.guild,
      Discord,
      args,
      guildPrefix: prefix,
      commandFunctions: require("@functions.commands"),
      emojis: {yes: "<:goodboi:786069262481621012>", no: "<:badboi:788537874140233759>"}
    };
    if (commandfile) {
      for (const bitfield of commandfile.help.userPermissions) {
        if (!message.member.permissions.has(bitfield, true)) {
          return await client.createMessage(
            ctx,
            client.createEmbed({
              color: client.color,
              description: `You are missing the permission \`${getPermName(
                bitfield
              )}\``
            })
          );
        }
      }
      
      commandfile.run(context || ctx, context || ctx);
    }
  } catch (e) {
    console.log(e);
  }
};
