var path = require('path');
var fs = require('fs');

var nodeModules = {};

fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './app/index.js',
    target: 'node',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    externals: nodeModules,
    module: {
       loaders: [
           {
               test: /\.js$/,
               loaders: [
                   'babel-loader',
               ],
           },
           {
               test:  /\.json$/,
               loader: 'json-loader',
           },
       ],
    },
};
