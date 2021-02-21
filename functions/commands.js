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
  cloneObj(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    let copy = obj.constructor();
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }
};
