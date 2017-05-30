[![Coverage Status](https://coveralls.io/repos/github/tsears/auth-api/badge.svg?branch=master)](https://coveralls.io/github/tsears/auth-api?branch=master)
[![Build Status](https://travis-ci.org/tsears/auth-api.svg?branch=master)](https://travis-ci.org/tsears/auth-api)
[![Code Climate](https://codeclimate.com/github/tsears/auth-api/badges/gpa.svg)](https://codeclimate.com/github/tsears/auth-api)

# auth-api
Basic authenticated API using Docker, Node, Restify, Passport, and Mongo

## Running

Copy .env.list.sample to .env.list and fill in the environment variables.  They'll
be used by docker to build the image.

~~~
npm run container:dev
~~~

## test
~~~
npm test
~~~

## license

Licened under the MIT license.  See LICENSE for details.
