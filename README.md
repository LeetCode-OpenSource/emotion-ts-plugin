# Emotion TypeScript Plugin
[![CircleCI](https://circleci.com/gh/LeetCode-OpenSource/emotion-ts-plugin.svg?style=svg)](https://circleci.com/gh/LeetCode-OpenSource/emotion-ts-plugin)
[![Coverage Status](https://coveralls.io/repos/github/LeetCode-OpenSource/emotion-ts-plugin/badge.svg?branch=master)](https://coveralls.io/github/LeetCode-OpenSource/emotion-ts-plugin?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/LeetCode-OpenSource/emotion-ts-plugin.svg)](https://greenkeeper.io/)

## Usage

```ts
const { join } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { createEmotionPlugin } = require('ts-emotion-plugin')

module.exports = {
  entry: './tests/fixtures/simple.tsx',

  output: {
    filename: '[name].[hash].js',
    path: join(process.cwd(), 'dist'),
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },

  mode: 'development',

  devtool: 'cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.(jsx|tsx|js|ts)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [createEmotionPlugin()],   // <------------------- here
          }),
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader?minimize'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: join(process.cwd(), 'tests', 'fixtures', 'index.html'),
    }),
  ]
}

```

## Options
- *sourcemap* [`boolean`]
  
  default `true`

  Generate sourcemap for debugging

- *autoLabel* [`boolean`]

  default `true`

  label the emotion expressions with `/*#__PURE__*/` for uglify-js
