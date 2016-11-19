var ssr = require('done-ssr-middleware');

module.exports = ssr({
  config: __dirname + "/package.json!npm",
  main: "bitcentive/index.stache!done-autorender",
  liveReload: true,
  auth: {
    cookie: "feathers-jwt",
    domains: [
      "localhost"
    ]
  }
});
