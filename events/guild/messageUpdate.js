module.exports = async (client, oldMsg, message) => {
  let Discord = require("discord.js");
  try {
    if (!message.author || message.member.bot || message.channel.type === "dm") return;
    let prefix = await client.getPrefix({ client }, message.guild.id);
    let args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix)) return;
    let responses = client.responses.get(message.author.id) || [];
    let ctx = {
      client,
      message,
      channel: message.channel,
      guild: message.guild,
      Discord,
      args,
      editedMessage:
        responses && responses.find(response => response.user === message.id)
          ? responses.find(response => response.user === message.id).bot
          : undefined
    };
    if (oldMsg.content != message.content) client.emit("message", message, ctx);
  } catch (e) {
    console.log(e);
  }
};
