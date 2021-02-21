let { model, Schema } = require("mongoose");
let userSchema = new Schema({
  user: { type: String, required: true },
  bal: { type: Object, default: { lollipops: 0, magicPoints: 0 } },
  cards: { type: Array, default: [] },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  totalXp: { type: Number, default: 0 },
  xpToLevelUp: { type: Number, default: 0 },
  cooldowns: { type: Object, default: { xp: 0 } }
});
module.exports = model("Users", userSchema);