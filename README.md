# Emotion TypeScript Plugin

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
