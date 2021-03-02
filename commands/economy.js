const { cmd} = require("../utils/cmd.js");
cmd("bal", "balance", async ctx => {
  let {
    client: { createMessage, createEmbed, color, getUserFromDb },
    commandFunctions: { getUser }
  } = ctx;
  let user = await getUser(ctx);
  let userData = await getUserFromDb(ctx, user.id);
  await createMessage(
    ctx,
    createEmbed({
      color,
      author: {
        name: `${user.user.username}\'s balance`,
        iconURL: user.user.avatarURL({ dynamic: true }),
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
}).help({
  name: "bal",
  description: "Sends a users balance",
  aliases:["balance"],
  usage:"[user]",
  category:"economy"
})
cmd("shop", "store", async ctx => {
 
}).help({
  name: "shop",
  description: "Sends the store",
  aliases:["store"],
  usage:"",
  category:"economy"
})