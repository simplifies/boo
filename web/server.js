const express = require("express");
const client = require("../index.js");
global.client = client
const path = require("path")
const app = express();
let routes = [{ url: "/", route: require("./routes/index.js") }];
routes.map(route => app.use(route.url, route.route));
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs")
app.listen(process.env.PORT, () => {
  console.log("App started");
});
