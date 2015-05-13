#!/usr/bin/env node
var fs           = require("fs");
var knex         = require("knex");
var yargs        = require('yargs');
var readlineSync = require("readline-sync");

var argv = yargs
  .usage('Usage: $0 [config-file]')
  .version(function() {
    return require('../package').version
  })
  .boolean("prompt")
  .default("prompt", true)
  .describe("prompt", "Prompt before db exec")
  .argv;

if(argv.help) {
  yargs.showHelp();
  process.exit(0);
}

var sql = "";
var configPath = process.cwd() + "/" + (argv._[0] || "knexfile.js");

process.stdin.setEncoding('utf8');
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    sql += chunk;
  }
});
process.stdin.on('end', function() {
  var args;
  if(sql.substr(0,1) === "{") {
    try {
      var raw = JSON.parse(sql);
      sql = raw.sql;
      args = raw.args;
    } catch(err) {
      console.error(err.toString());
      return;
    }
  }

  try {
    var confRaw = fs.readFileSync(configPath);
  } catch(err) {
    console.error(err.toString());
    process.exit(1);
  }
  var conf = JSON.parse(confRaw.toString());

  if(!argv["prompt"]) {
    var client = conf.client;
    var database = conf.connection.database || conf.connection.filename;
    var msg = "Connecting to '"+client+"' database '"+database+"' [Yn]";
    var confirm= readlineSync.question(msg);

    if(confirm !== "Y") {
      process.exit(0);
      return;
    }
  }

  knex(conf)
    .raw(sql, args)
    .then(function(output) {
      console.log(
        JSON.stringify(output, null, "  ")
      );
      process.exit(0);
    })
    .catch(function(err) {
      console.error(err);
      process.exit(1);
    });
});

