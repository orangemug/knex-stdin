# knex-stdin
[![Build Status](https://travis-ci.org/orangemug/knex-stdin.svg?branch=master)](https://travis-ci.org/orangemug/knex-stdin)
[![Code Climate](https://codeclimate.com/github/orangemug/knex-stdin/badges/gpa.svg)](https://codeclimate.com/github/orangemug/knex-stdin)

**IN DEVEOPMENT NOT STABLE**

Pipe some SQL into a database using knex. It'll also detect whether an object has been passed (`{sql: "SQL", args: []}`) automatically.

Designed to be used in **development** alongside [sql-stamp](https://github.com/orangemug/sql-stamp) CLI. For example

    sql-stamp ./path/to.sql --name orangemug | knex-stdin ./knexfile.js


## License
MIT
