module.exports.run = async (
  ctx,
  {
    client: { createMessage, createEmbed, color, getUserFromDb },
    commandFunctions: { getUser }
  }
) => {
  let user = await getUser(ctx);
  let userData = await getUserFromDb(ctx, user.id);
  await createMessage(
    ctx,
    createEmbed({
      color,
      author: {
        name: `${user.user.username}\'s balance`,
        iconURL: user.user.avatarURL({ dynamic: true  }),
        url: user.user.avatarURL({ dynamic: true })
      },
      fields: [
        {
          name: "Lollipops",
          value: `${
            user.user.username
          } has \`${userData.bal.lollipops.toLocaleString()}🍭\` lollipops`
        },
        {
          name: "Magic points",
          value: `${
            user.user.username
          } has \`${userData.bal.magicPoints.toLocaleString()}✨\` magicpoints`
        }
      ]
    })
  );
};
module.exports.help = {
  name: "balance",
  owner: false,
  description: "Sends a users balance",
  usage: "[user]",
  category: "economy",
  aliases: ["bal"],
  userPermissions: [require("discord.js").Permissions.FLAGS.SEND_MESSAGES],
  get botPermissions() {
    return this.userPermissions;
  }
};
