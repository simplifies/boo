module.exports.run = async (
  ctx,
  {
    client: {
      createMessage,
      createEmbed,
      color,
      db,
      cachedPrefixs,
      getAllGuildData,
      changeSettings
    },
    args,
    guildPrefix,
    message,
    emojis: { yes, no }
  }
) => {
  let model = require("@db.guild");
  function type(boolean) {
    return boolean === true ? yes : no;
  }
  let data = await db.findInstance({ guild: ctx.message.guild.id }, model);
  return await createMessage(
    ctx,
    createEmbed({
      color,
      description: `${data
        .filter(product => [true, false].includes(data[product]))
        .map(stuff => `${data[`${stuff}`]}: ${type(`${data[`${stuff}`]}`)}`)
        .join("\n")}`
    })
  );
};
module.exports.help = {
  name: "settings",
  owner: false,
  description: "Views this servers settings",
  usage: "",
  category: "config",
  aliases: ["config"],
  userPermissions: [
    require("discord.js").Permissions.FLAGS.SEND_MESSAGES,
    require("discord.js").Permissions.FLAGS.MANAGE_MESSAGES
  ],
  botPermissions: [require("discord.js").Permissions.FLAGS.SEND_MESSAGES]
};
