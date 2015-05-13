var assert = require("assert");
var cp     = require("child_process");
var fs     = require("fs");
var knex   = require("knex");
var conf   = require("./config/knexfile.json");

describe("knex-stdin", function() {
  before(function() {
    var conn = knex(conf);

    // Connect to SQLite add in some data
    return conn.schema
      .createTable("users", function(table) {
        table.string("name");
      })
      .then(function() {
        return conn("users").insert({
          name: "orangemug"
        });
      });
  });

  after(function(done) {
    fs.unlink(__dirname+"/../"+conf.connection.filename, done);
  });

  // Yeah...I need more tests
  it("plain string input", function(done) {
    var cmd = 'echo "select name from users;" | ./bin/cli.js --no-prompt=true ./test/config/knexfile.json';

    cp.exec(cmd, function(err, stdout, stderr) {
      assert(!err);
      assert.equal(JSON.parse(stdout)[0].name, "orangemug");
      assert.equal(stderr, "");
      done();
    });
  });

  it("object input", function(done) {
    var cmd = 'echo "{\\"sql\\": \\"select name from users where name = ?;\\", \\"args\\": [\\"orangemug\\"]}" | ./bin/cli.js --no-prompt=true ./test/config/knexfile.json';

    cp.exec(cmd, function(err, stdout, stderr) {
      assert(!err);
      assert.equal(JSON.parse(stdout)[0].name, "orangemug");
      assert.equal(stderr, "");
      done();
    });
  })
});
