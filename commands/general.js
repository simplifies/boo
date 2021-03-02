const { cmd, tree } = require("../utils/cmd.js");
String.prototype.toProperCase = function() {
  return this.toLowerCase().replace(/(\b\w)/gi, w => w.toUpperCase());
};
cmd("ping", "pong", async ctx => {
  let {
    client: {
      createMessage,
      createEmbed,
      color,
      ws: { ping }
    }
  } = ctx;
  let guildModel = require("@db.guild");
  let beforeDbPing = Date.now();
  await guildModel.find();
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
}).help({
  name: "ping",
  description: "Pings the bot",
  aliases: ["pong"],
  usage: "",
  category: "general"
});
cmd("help", "h", async ctx => {
  let {
    client: { createMessage, createEmbed, color },
    commandFunctions: { multiDimensionalUnique, pagify }
  } = ctx;
  let commands = tree["cmd"];
  let command = commands[ctx.args[0]];
  if (command) {
    let embed = createEmbed({ color });
    embed.setTitle("Command help");
    embed.setThumbnail(ctx.client.user.avatarURL({ format: "png" }));
    Object.keys(command.help).map((cmd, i) => {
      if (Object.values(command.help)[i])
        embed.addField(
          cmd.toProperCase(),
          `${
            typeof Object.values(command.help)[i] === "string"
              ? Object.values(command.help)[i]
              : Object.values(command.help)[i].join(" | ")
          }`
        );
    });
    return await createMessage(ctx, embed);
  } else {
    let pages = [];
    let cats = [
      ...new Set(
        Object.values(commands).map(({ help: { category } }) => category)
      )
    ];
    
    cats
      .map(cat =>
        [
          ...new Set(
            Object.values(commands).filter(
              ({ help: { category } }) => category === cat
            )
          )
        ].map(cmd => `${cmd.help.name}`)
      )
      .map(x => [...new Set(x)])
      .map((x, i) => {
        let embed = createEmbed({ color });
        embed.setTitle(cats[i].toProperCase());
        embed.setThumbnail(ctx.client.user.avatarURL({ format: "png" }));
        embed.setDescription(
          `There are all of the ${cats[i].toProperCase()} commands use ${
            ctx.guildPrefix
          }help [command] for more info on a command\n\n \`\`\`${x
            .map(c => `${c}`)
            .join(" | ")}\`\`\``
        );
        pages.push(embed);
      });
    return await pagify(ctx, {
      type: "embed",
      messages: pages
    });
  }
}).help({
  name: "help",
  description: "Sends the help menu",
  aliases: ["h"],
  usage: "[command]",
  category: "general"
});