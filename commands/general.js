const { cmd } = require("../utils/cmd.js");
cmd("ping", "pong", async ctx => {
  let {
    client: {
      createMessage,
      createEmbed,
      color,
      ws: { ping }
    }
  } = ctx
  let guildModel = require("@db.guild");
  let beforeDbPing = Date.now();
  guildModel.find();
  let dbPing = Date.now() - beforeDbPing;
  let firstPingEmbed = createEmbed({
    color,
    fields: [
      {
        name: "Websocket",
        value: `${
          ping <= 250
            ? "<:greenemoji:808815930703478784>"
            : "<:yellowemoji:808815887179055145>"
        } ${ping} ms`
      },
      {
        name: "Database",
        value: `${
          dbPing <= 250
            ? "<:greenemoji:808815930703478784>"
            : "<:yellowemoji:808815887179055145>"
        } ${dbPing} ms`
      }
    ]
  });
  let m = await createMessage(ctx, firstPingEmbed);
  await m.delete();
  let correctPing = m.createdTimestamp - ctx.message.createdTimestamp;

  firstPingEmbed.addField(
    "Roundtrip",
    `${
      correctPing <= 250
        ? "<:greenemoji:808815930703478784>"
        : "<:yellowemoji:808815887179055145>"
    } ${correctPing} ms`
  );
  await createMessage(ctx, firstPingEmbed);
});
