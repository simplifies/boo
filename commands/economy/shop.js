module.exports.run = async (
  ctx,
  {
    client: { createMessage, createEmbed, color, getUserFromDb }, args
  }
) => {
  let userData = await getUserFromDb(ctx, ctx.message.author.id);
 
};
module.exports.help = {
  name: "shop",
  owner: false,
  description: "Sends the shop",
  usage: "[item]",
  category: "economy",
  aliases: ["placetobuy"],
  userPermissions: [require("discord.js").Permissions.FLAGS.SEND_MESSAGES],
  get botPermissions() {
    return this.userPermissions;
  }
};
