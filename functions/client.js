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
      return m;
    }
  },
  createEmbed(ops = {}) {
    return new MessageEmbed({ ...ops });
  },
  async getPrefix(ctx, guildId) {
    let data = require("@db.guild");
    let fetched = await ctx.client.db.findInstance({ guild: guildId }, data);
    if (!fetched)
      fetched = await ctx.client.db.create({ guild: guildId }, data);
    return fetched.prefix;
  },
  async getUserFromDb(ctx, userId) {
    let data = require("@db.user");
    let fetched = await ctx.client.db.findInstance({ user: userId }, data);
    if (!fetched) fetched = await ctx.client.db.create({ user: userId }, data);
    return fetched;
  },
  async getAllGuildData(ctx, guildId) {
    let data = require("@db.guild");
    let fetched = await ctx.client.db.findInstance({ guild: guildId }, data);
    if (!fetched)
      fetched = await ctx.client.db.create({ guild: guildId }, data);
    return fetched;
  },
  async rankCard(context, message, user) {
    const Canvas = require("canvas");
    const canvas = Canvas.createCanvas(1000, 333);
    const ctx = canvas.getContext("2d");
    const font = "Manrope";
    let { roundRect, canvasUsername } = require("@functions.canvas");
    let RankData = context.client.getUserFromDb(user.id);
    ctx.fillStyle = "#282a2c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2e3033";
    ctx.fillRect(0, 0, canvas.width, 25);
    ctx.fillRect(0, 0, 25, canvas.height);
    ctx.fillRect(canvas.width - 25, 0, canvas.width, canvas.height);
    ctx.fillRect(0, canvas.height - 25, canvas.width, canvas.height);

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffffff";
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "#000000";
    roundRect(ctx, 43, 233, 700, 58, 32, false, true);
    ctx.strokeStyle = "#ffffff";
    roundRect(ctx, 40, 230, 700, 58, 32, true, false, "#282a2c");
    ctx.closePath();

    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.fillStyle = message.member.displayHexColor;
    ctx.arc(69, 259, 28.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillRect(69, 230, (100 / RankData.requiredXP) * RankData.xp * 6.4, 58);
    ctx.arc(
      69 + (100 / RankData.requiredXP) * RankData.xp * 6.4 - 1,
      259,
      28.5,
      1.5 * Math.PI,
      0.5 * Math.PI,
      false
    );
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    roundRect(ctx, 40, 230, 700, 58, 32, false, true);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = `33px ${font}`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.fillText(
      `${
        RankData.xp >= 1000
          ? (RankData.xp / 1000).toPrecision(4) + "k"
          : RankData.xp
      } / ${
        RankData.level * 300 >= 1000
          ? ((RankData.level * 300) / 1000).toPrecision(2) + "k"
          : RankData.xp
      }`,
      392,
      272
    );
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      `${
        RankData.xp >= 1000
          ? (RankData.xp / 1000).toPrecision(4) + "k"
          : RankData.xp
      } / ${
        RankData.level * 300 >= 1000
          ? ((RankData.level * 300) / 1000).toPrecision(2) + "k"
          : RankData.xp
      }`,
      390,
      270
    );

    ctx.font = `bold 42px ${font}`;

    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.fillText(
      canvasUsername(
        ctx,
        canvas,
        user.username,
        user.discriminator,
        canvas.width / 6,
        ctx.font,
        ctx.textAlign,
        0,
        300
      ),
      canvas.width / 6,
      123
    );
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      canvasUsername(
        ctx,
        canvas,
        user.username,
        user.discriminator,
        canvas.width / 6,
        ctx.font,
        ctx.textAlign,
        0,
        300
      ),
      canvas.width / 6 - 2,
      121
    );

    ctx.font = `bold 36px ${font}`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.fillText("Level:", 188, 203);
    ctx.fillStyle = "#999999";
    ctx.fillText("Level:", 185, 200);

    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.fillText(
      RankData.level >= 1000
        ? `${(RankData.level / 1000).toPrecision(3)}k`
        : `${RankData.level}`,
      248,
      203
    );
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      RankData.level >= 1000
        ? `${(RankData.level / 1000).toPrecision(3)}k`
        : `${RankData.level}`,
      245,
      200
    );

    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 1;
    ctx.fillText("Rank:", 553, 203);

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#999999";
    ctx.fillText("Rank:", 550, 200);

    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 1;
    ctx.fillText(
      RankData.guildRank >= 1000
        ? `${(RankData.guildRank / 1000).toPrecision(3)}k`
        : `${RankData.guildRank}`,
      613,
      203
    );

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      RankData.guildRank >= 1000
        ? `${(RankData.guildRank / 1000).toPrecision(3)}k`
        : `${RankData.guildRank}`,
      610,
      200
    );

    ctx.save();
    ctx.beginPath();
    ctx.arc(853, 153, 100, 0, Math.PI * 2, true);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(850, 150, 100, 0, Math.PI * 2, true);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ format: "png", size: 2048 })
    );
    ctx.drawImage(avatar, 746, 46, 220, 220);
    ctx.closePath();
    ctx.restore();

    ctx.fillStyle = "#282a2c";
    ctx.beginPath();
    ctx.arc(777, 223, 30, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();

    if (user.presence.status == "dnd") {
      ctx.beginPath();
      ctx.fillStyle = "#F04747";
      ctx.arc(777, 223, 19, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      roundRect(ctx, 762, 219, 29, 9, 6, true, false, "#282a2c");
      ctx.closePath();
    } else if (user.presence.status == "idle") {
      ctx.beginPath();
      ctx.fillStyle = "#faa61a";
      ctx.arc(777, 223, 19, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.fillStyle = "#282a2c";
      ctx.arc(770, 214, 13.8, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    } else if (user.presence.status == "online") {
      ctx.fillStyle = "#43b581";
      ctx.beginPath();
      ctx.arc(777, 223, 19, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
    } else if (user.presence.status == "offline") {
      ctx.fillStyle = "#747f8e";
      ctx.beginPath();
      ctx.arc(777, 223, 19, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = "#2f3136";
      ctx.beginPath();
      ctx.arc(777, 223, 10, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
    }

    if (user.presence.activities.length > 0) {
      if (
        user.presence.activities.find(a => a.type == "STREAMING") !== undefined
      ) {
        ctx.restore();
        ctx.fillStyle = "#282a2c";
        ctx.beginPath();
        ctx.arc(777, 223, 30, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#593696";
        ctx.arc(777, 223, 20, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#282a2c";
        ctx.fillStyle = "#282a2c";
        ctx.restore();
        ctx.beginPath();
        ctx.moveTo(770, 213);
        ctx.lineTo(770, 234);
        ctx.lineTo(788, 223);
        ctx.lineTo(770, 213);
        ctx.fill();
        ctx.closePath();
      }
    }
    return canvas.toBuffer("image/png");
  }
};
