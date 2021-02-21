module.exports.run = async (
  ctx,
  {
    client: { createMessage, createEmbed, color, db, cachedPrefixs },
    args,
    guildPrefix,
    message
  }
) => {
  let prefix = args[0];
  if (!prefix)
    return await createMessage(
      ctx,
      createEmbed({
        color,
        description: `This servers current prefix is \`${guildPrefix}\``
      })
    );
  await db.set("prefix", {
    model: require("@db.guild"),
    by: { guild: ctx.message.guild.id },
    newValue: prefix.toLowerCase() === "default" ? "bo." : prefix
  });
  cachedPrefixs[message.guild.id] =
    prefix.toLowerCase() === "default" ? "bo." : prefix;
  return await createMessage(
    ctx,
    createEmbed({
      color,
      description: `New prefix \`${
        prefix.toLowerCase() === "default" ? "bo." : prefix
      }\``
    })
  );
};
module.exports.help = {
  name: "prefix",
  owner: false,
  description: "Changes the bots prefix",
  usage: "[newprefix]",
  category: "config",
  aliases: ["setprefix", "sp", "newprefix"],
  userPermissions: [
    require("discord.js").Permissions.FLAGS.SEND_MESSAGES,
    require("discord.js").Permissions.FLAGS.MANAGE_MESSAGES
  ],
  botPermissions: [require("discord.js").Permissions.FLAGS.SEND_MESSAGES]
};
