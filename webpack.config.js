const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const app = require('./app.json');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

require('dotenv').config();

module.exports = (env) => {
  const dirDist = path.resolve(__dirname, 'dist');
  const dirSrc = path.resolve(__dirname, 'src');
  const dev = process.env.NODE_ENV.trim() === 'development';
  const port = process.env.PORT || 8080;

  let serveHttps = false;
  if (process.env.SSL_KEY && process.env.SSL_CRT && process.env.SSL_PEM) {
    serveHttps = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CRT),
      ca: fs.readFileSync(process.env.SSL_PEM),
    };
  }

  if (dev) {
    console.log('+ DEV SERVER ++++++++++++++');
    console.log(`${serveHttps ? 'https://' : 'http://'}localhost:${port}`);
    console.log('+ /DEV SERVER +++++++++++++');
  }

  return {
    entry: {
      app: `${dirSrc}/index.ts`,
    },
    performance: {
      hints: false,
    },
    output: {
      path: dirDist,
      filename: dev ? 'assets/[name].js' : 'assets/[name]-[fullhash].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    mode: dev ? 'development' : 'production',
    devServer: {
      //contentBase: dirDist,
      compress: true,
      port,
      https: serveHttps,
      historyApiFallback: true,
      hot: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: app.title,
        description: app.description,
        template: 'src/index.html',
        filename: './index.html',
        chunksSortMode: 'none',
        minify: dev
          ? false
          : {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            },
      }),
      new MiniCssExtractPlugin({
        filename: dev ? 'assets/[name].css' : 'assets/[name].[hash].css',
        chunkFilename: dev
          ? 'assets/[name].[id].css'
          : 'assets/[name].[id].[hash].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/static',
            to: 'assets/static',
          },
        ],
      }),
      ...(dev ? [new webpack.SourceMapDevToolPlugin({})] : []),
      new CleanWebpackPlugin(),
      ...(!dev
        ? [
            new InjectManifest({
              swSrc: './src/service-worker.js',
              include: [/\.html$/, /\.js$/, /\.css$/],
              maximumFileSizeToCacheInBytes: 5000000,
            }),
          ]
        : []),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      plugins: [new TsconfigPathsPlugin()],
    },
  };
};
