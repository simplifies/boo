module.exports = async (client, message, context) => {
  const { trigger } = require("../../utils/cmd");
  let Discord = require("discord.js");
  try {
    let prefix = await client.getPrefix({ client }, message.guild.id);
    let args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    let ctx = {
      client,
      message,
      channel: message.channel,
      guild: message.guild,
      Discord,
      args,
      guildPrefix: prefix,
      commandFunctions: require("@functions.commands"),
      canvasFunctions: require("@functions.canvas"),
      emojis: {
        yes: "<:goodboi:786069262481621012>",
        no: "<:badboi:788537874140233759>"
      },
      workers: {
        text: {
          this: {
            guild: {
              settings: `${message.guild.name}'\s settings`,
              help: {
                settings: `React with the number which matches the setting you want to change`
              }
            }
          }
        }
      }
    };
    if (message.author.bot || message.channel.type === "dm") return;
    client.emit("level", message, ctx);
    if (!message.content.startsWith(prefix)) return;
    await trigger("cmd", ctx, message.member, args, prefix);
  } catch (e) {
    console.log(e);
  }
};
