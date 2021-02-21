let { MessageEmbed } = require("discord.js");
module.exports = {
  async createMessage(ctx, content, ops = {}) {
    if (ctx.editedMessage) {
      let m = await ctx.channel.messages.fetch(ctx.editedMessage);
      if (m) {
        m.edit(content);
        return m;
      }
    } else {
      let m = await ctx.channel.send(content);
      let newResponses = ctx.client.responses.get(ctx.message.author.id) || [];
      newResponses.unshift({ user: ctx.message.id, bot: m.id });
      ctx.client.responses.set(ctx.message.author.id, newResponses);
      return m;
    }
  },
  createEmbed(ops = {}) {
    return new MessageEmbed({ ...ops });
  },
  async getPrefix(ctx, guildId) {
    let cached = ctx.client.cachedPrefixs;
    let data = require("@db.guild");
    let fetched = await ctx.client.db.findInstance({ guild: guildId }, data);
    if (!fetched)
      fetched = await ctx.client.db.create({ guild: guildId }, data);
    if (cached[guildId]) {
      return cached[guildId];
    } else {
      cached[guildId] = fetched.prefix;
      return fetched.prefix;
    }
  },
  async getUserFromDb(ctx, userId) {
    let cached = ctx.client.cachedProfiles;
    let data = require("@db.user");
    let fetched = await ctx.client.db.findInstance({ user: userId }, data);
    if (!fetched) fetched = await ctx.client.db.create({ user: userId,  }, data);
    if (cached[userId]) {
      return cached[userId];
    } else {
      cached[userId] = fetched;
      return fetched;
    }
  },
  async getAllGuildData(ctx, guildId){
    let data = require("@db.guild")
    let fetched = await ctx.client.db.findInstance({ guild: guildId }, data)
    if(!fetched) fetched = await ctx.client.db.create({ guild: guildId }, data);
    return fetched
  }
};
