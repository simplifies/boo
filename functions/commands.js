module.exports = {
  async getUser(ctx) {
    await ctx.guild.members.fetch({
      withPresences: true
    });
    let joins = ctx.guild.members.cache
      .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
      .array();
    return (
      ctx.message.mentions.members.first() ||
      ctx.guild.members.cache.get(ctx.args[0]) ||
      joins[ctx.args[0]] ||
      ctx.message.guild.members.cache.find(m =>
        [m.user.username, m.displayName, m.user.tag].some(
          e => e.toLowerCase() === ctx.args.join(" ").toLowerCase()
        )
      ) ||
      ctx.message.member
    );
  },
  async pagify(ctx, options = {}) {
    String.prototype.replaceAt = function(index, replacement) {
      return (
        this.substr(0, index) +
        replacement +
        this.substr(index + replacement.length)
      );
    };
    let message = ctx.message;
    if (!(message instanceof ctx.Discord.Message))
      throw new TypeError(
        "First parameter must be a type of <discord.js>.Message"
      );
    options = {
      page: options.page,
      type: ["message", "embed"].includes(
        options.type && options.type.toString().toLowerCase()
      )
        ? options.type
        : "message",
      messages: Array.isArray(options.messages) ? options.messages : []
    };
    if (!options.messages.length)
      throw new TypeError("'options.messages' must have at least one element");
    if (
      options.type === "embed" &&
      !options.messages.every(m => m instanceof ctx.Discord.MessageEmbed)
    )
      throw new TypeError(
        "'options.type' were chosen as 'embed' but not every element of 'options.messages' were an instance of <discord.js>.MessageEmbed"
      );
    let pages = 0,
      reactions =
        options.messages.length > 1 ? ["⏪", "◀️", "⏹️", "▶️", "⏩"] : ["⏹️"],
      mainMessage = await message.channel.send(
        `${options.messages.length > 1 ? `[${pages + 1}/${options.messages.length}] ${"○".repeat(
          options.messages.length
        ).replaceAt(pages, "●")}` : ""}`,
        options.messages[pages]
      );
    await Promise.all(reactions.map(r => mainMessage.react(r)));
    let collector = mainMessage.createReactionCollector(
      (reaction, user) =>
        reactions.some(r => r === reaction.emoji.name) &&
        user.id === message.author.id,
      {
        time: options.time
      }
    );
    collector.on("collect", async (reaction, user) => {
      switch (reaction.emoji.name) {
        case "⏪":
          if (pages === 0) return;
          pages = 0;
          break;
        case "◀️":
          if (pages === 0) {
            pages = options.messages.length - 1;
          } else {
            pages -= 1;
          }
          break;
        case "⏹️":
          for (let reaction of mainMessage.reactions.cache
            .filter(r => r.users.cache.has(ctx.client.user.id))
            .array()) {
            await reaction.users.remove(ctx.client.user.id);
          }
          return collector.stop();
          break;
        case "▶️":
          if (pages === options.messages.length - 1) {
            pages = 0;
          } else {
            pages += 1;
          }
          break;
        case "⏩":
          if (pages === options.messages.length - 1) return;
          pages = options.messages.length - 1;
          break;
      }
      await mainMessage.edit(
       `${options.messages.length > 1 ? `[${pages + 1}/${options.messages.length}] ${"○".repeat(
          options.messages.length
        ).replaceAt(pages, "●")}` : ""}`,
        options.type === "message"
          ? options.messages[pages]
          : {
              embed: options.messages[pages]
            }
      );
    });
  }
};
