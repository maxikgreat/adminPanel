const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

let dist = path.resolve('/Applications/MAMP/htdocs/example/', 'webpack-dev');

if (isProd) {
    dist = path.resolve('/Applications/MAMP/htdocs/example/', 'webpack-build');
}

const filename = extension => isDev ? `[name].${extension}` : `[name].[hash].${extension}`;

const babelOptions = preset => {
    // default options
    const options = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if(preset) {
        options.presets.push(preset);
    }

    return options;
}

const cssLoaders = extra => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDev,
            reloadAll: true
        }
    }, 'css-loader'];

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
}

module.exports = {
    context: path.resolve(__dirname, 'app'),
    mode: 'development', 
    entry: {
        main: './src/main.js'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(dist),
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
        new CopyWebpackPlugin({
            patterns: [
              { from: './api', to: `${dist}/api`},
              { from: './assets', to: `${dist}/assets`}
            ],
          }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            }
        ]
    }
};