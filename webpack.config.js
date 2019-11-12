const { join } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { createEmotionPlugin } = require('./lib/index')

module.exports = {
  entry: './tests/fixtures/component-as-selector.tsx',

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
            before: [createEmotionPlugin()],
          }),
          compilerOptions: {
            module: 'esnext',
            jsxFactory: '___EmotionJSX',
          },
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
  ],
}
