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
        devtool: 'source-map',
        externals: nodeModules,
        module: {
            rules: [{
                test: /\.js$/,
                use: [
                    'babel-loader',
                    'source-map-loader',
                ],
            }, {
                test: /\.json$/,
                use: [
                    'json-loader',
                ],
            }],
        },
    };
