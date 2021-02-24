function permName(bitfield = 0) {
  for (let key in require("discord.js").Permissions.FLAGS)
    if (require("discord.js").Permissions.FLAGS[key] == bitfield) return key;
  return null;
}
const tree = {
  cmd: {},
  rct: {}
};
const cmd = (...args) => buildTree(args);
const pcmd = (perms, ...args) => buildTree(args, perms);
const rct = (...args) => {
  const callback = args.pop();
  const cursor = tree.rct;

  args.map(alias => {
    if (!cursor.hasOwnProperty(alias)) {
      cursor[alias] = {};
    }

    cursor[alias].callback = callback;
  });
};

const buildTree = (args, perms) => {
  const callback = args.pop();
  const cursors = [];

  args.map(alias => {
    let sequence = Array.isArray(alias) ? alias : [alias];
    let cursor = tree.cmd;

    sequence.map(arg => {
      if (!cursor.hasOwnProperty(arg)) {
        cursor[arg] = {};
      }

      cursor = cursor[arg];
    });

    cursor.callback = callback;

    if (perms) cursor.perms = perms;
    cursors.push(cursor);
  });

  const chain = {
    access: arg => {
      cursors.map(x => {
        x._access = arg;
      });
      return chain;
    }
  };

  return chain;
};

const trigger = async (type, ctx, user, args) => {
  let cursor = tree[type];
  while (cursor.hasOwnProperty(args[0])) {
    cursor = cursor[args[0]];
    args.shift();
  }

  if (!cursor.hasOwnProperty("callback")) return;
  const newArgs = [ctx, user || {}].concat(args);
  try {
    if (cursor.perms) {
      for (const bitfield of cursor.perms) {
        if (!user.permissions.has(bitfield, true))
          return await ctx.client.createMessage(
            ctx,
            `You are missing of the following permissions ${cursor.perms
              .filter(perm => !user.permissions.has(perm, true))
              .map(perm => `\`${permName(perm)}\``)
              .join(" | ")}`
          );
      }
    }
    return await cursor.callback.apply({}, newArgs);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  cmd,
  pcmd,
  rct,
  trigger
};
