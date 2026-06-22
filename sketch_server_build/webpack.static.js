const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const fs = require('fs');
const entryMap = {};

fs.readdirSync(path.resolve(__dirname, 'src/js/'))
    .filter((f) => fs.lstatSync(path.resolve(__dirname, 'src/js/'), '/' + f).isDirectory() && f.indexOf('sketch') >= 0)
    .map((f) => {
        return f
    })
    .map((f) => [f, fs.readdirSync(path.resolve(__dirname, 'src/js/') + '/' + f).filter(name => name == 'app.js')])
    .filter(f => f[1].length > 0)
    .forEach(f => {
        entryMap[f[0]] = [ path.resolve(__dirname, 'src/js/') + '/' + f[0] + '/'  + f[1]];
    });

module.exports = (env) => {
  const htmlPlugins = Object.keys(entryMap).map(name => {
    return new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/html/index.html'),
      filename: name + '/index.html',
      chunks: [name],
      inject: false,
      title: 'ThreeJS Playground',
      templateParameters: (compilation, assets, assetTags, options) => {
        let chunkId = options.filename.split('/')[0]
        assetTags.headTags = assetTags.headTags.filter(tag => {
          if (tag.attributes && tag.attributes.src) {
            return tag.attributes.src.indexOf(chunkId) >= 0
          }
          if (tag.attributes && tag.attributes.href) {
            return tag.attributes.href.indexOf(chunkId) >= 0
          }
          return true
        })
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options
          },
          chunkId
        }
      },
    })
  });

  return {
    entry: entryMap,
    mode: 'production',
    output: {
      path: path.resolve(__dirname, './static'),
      filename: '[name]/[name].js',
      publicPath: '../'
    },
    resolve: {
      extensions: [".js", ".css", ".jpg"],
      modules: [path.resolve(__dirname, 'src/public'), path.resolve(__dirname, 'src/js'), path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src/js/[name]')],
      fallback: {
        "fs": false,
        "os": false,
        "path": false,
        "webworker-threads": false
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify('prod')
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new MiniCssExtractPlugin({
        filename: '[name]/[name].bundle.css',
        chunkFilename: '[id].css'
      }),
      ...htmlPlugins,
      new CopyPlugin({
        patterns: [
          { from: 'src/public/textures', to: 'assets/textures' },
          { from: 'src/public/models', to: 'assets/models' },
          { from: 'src/public/fonts', to: 'assets/fonts' },
          { from: 'src/public/js/ammo.js', to: 'assets/js/ammo.js' },
          { from: 'src/public/studio-bg.jpg', to: 'assets/studio-bg.jpg' },
          { from: 'src/public/css', to: 'assets/css' },
        ]
      })
    ],
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          include: path.resolve(__dirname, 'src/js'),
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  "targets": {
                    "node": "12"
                  }
                }],
                '@babel/preset-react'
              ]
            }
          }]
        },
        {
          test: /\.(frag|vert)/i,
          use: 'raw-loader',
        },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  config: "./postcss.config.js"
                }
              }
            }
          ]
        },
        {
          test: /\.(jpg|png|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name][ext]'
          }
        }
      ]
    },
  }
}
