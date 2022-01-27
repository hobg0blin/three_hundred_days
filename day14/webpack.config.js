const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
module.exports = (env) => {
  console.log('ENVIRONMENT: ', env)
  let mode = "development"
  if (env.NODE_ENV === 'prod') {
    devtool = 'hidden-source-map'
    mode = 'production'
    stats = 'none'
  }
  return {
    entry: path.join(__dirname, 'src/js', 'app.js'),
    mode: mode,
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js'
    },
    plugins: [
/* FAILED ATTEMPT TO COPY FONTS TO DIST
 * new CopyPlugin({
      patterns:
        [{from: './node_modules/three/examples/fonts/', to: "./dist/fonts/"}]}), */
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify(env.NODE_ENV)
      }),

      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
        chunkFilename: '[id].css'
      }),
      new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
        title: 'Three.js Webpack ES6 Boilerplate',
        template: path.join(__dirname, 'src/html/index.html'),
        path: path.resolve(__dirname, './dist'),
        filename: 'index.html'
  })
    ],
    devServer: {
      open: true,
      static: './dist',
      hot: true,
      headers: {
      "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      }
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          include: path.resolve(__dirname, 'src'),
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
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap:true
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
      ]
    },
  }
}

