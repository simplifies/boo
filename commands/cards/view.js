module.exports.run = async (
  ctx,
  {
    client: { createMessage, createEmbed, color, getUserFromDb },
    args,
    commandFunctions: { getUser }
  }
) => {
  let user = await getUser(ctx);
  let userData = await getUserFromDb(ctx, user.id);
  await createMessage(
    ctx,
    createEmbed({
      color,
      description: `${
        !userData.cards.length
          ? "None"
          : userData.cards.map(
              card => `${card.id} ${"★".repeat(card.rating)}${"☆".repeat(4 - card.rating)} ${card.name}`
            ).join("\n")
      }`
    })
  );
};
module.exports.help = {
  name: "view",
  owner: false,
  description: "Views your cards or someone elses cards",
  usage: "[user]",
  category: "cards",
  aliases: ["cards", "collection"],
  userPermissions: [require("discord.js").Permissions.FLAGS.SEND_MESSAGES],
  get botPermissions() {
    return this.userPermissions;
  }
};
