
const { resolve, basename } = require('path');
const { readdirSync } = require('fs');
const webpack = require('webpack');

// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");


const ROOT = resolve(__dirname);
const NAME = basename(ROOT);
const ASSETS_PUBLIC_PATH = `/client/assets/${NAME}/`;
const BUNDLE_ENTRY_PATH = resolve(ROOT, 'src/index.ts');
const STYLE_ENTRY_PATH = resolve(ROOT, 'style/index.js');
const OUTPUT_DIR = resolve(ROOT, 'dist');
const SDI_ALIAS_ROOT = resolve(ROOT, '../sdi/');
const SDI_ALIAS = readdirSync(SDI_ALIAS_ROOT).reduce((acc, dir) => {
    acc[`sdi/${dir}`] = resolve(SDI_ALIAS_ROOT, dir);
    return acc;
}, {})

console.log(`ROOT ${ROOT}`);
console.log(`BUNDLE_ENTRY_PATH ${BUNDLE_ENTRY_PATH}`);
console.log(`STYLE_ENTRY_PATH ${STYLE_ENTRY_PATH}`);
console.log(`OUTPUT_DIR ${OUTPUT_DIR}`);
console.log(`SDI_ALIAS ${JSON.stringify(SDI_ALIAS, null, 2)}`);


// SDI_ALIAS['openlayers'] = '/home/pierre/System/src/be-sdi/sdi-clients/node_modules/openlayers/dist/ol-debug.js'


module.exports = {
    context: ROOT,
    entry: {
        bundle: BUNDLE_ENTRY_PATH,
        style: STYLE_ENTRY_PATH,
    },

    output: {
        path: OUTPUT_DIR,
        publicPath: '/',
        filename: '[name].js',
        library: 'bundle',
        libraryExport: 'main',
        libraryTarget: 'assign',
    },

    resolve: {
        alias: SDI_ALIAS,
        // proj4 module declaration is not consistent with its ditribution
        mainFields: ["browser", "main", /* "module" */],
        extensions: ['.ts', '.js'],
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: resolve(ROOT, '../node_modules/'),
                loader: 'source-map-loader',
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                use: "source-map-loader"
            },
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                    }
                ],
            },


            /**
             * Style
             */
            // CSS
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },

            // LESS
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!less-loader"
                })
            },

            //fonts
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    publicPath: ASSETS_PUBLIC_PATH
                }
            },

            //images
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'file-loader',
                options: {
                    publicPath: ASSETS_PUBLIC_PATH
                }
            }
        ]
    },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin(),
    // ]
    plugins: [
        new ExtractTextPlugin("[name].css"),
    ],
    devtool: 'source-map',
    // devtool: 'cheap-module-eval-source-map',
};
