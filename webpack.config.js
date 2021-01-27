const { join } = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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

  devServer: {
    port: 1234,
  },

  devtool: 'cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.(jsx|tsx|js|ts)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              createEmotionPlugin({
                autoInject: true,
                jsxImportSource: '@emotion/react',
              }),
            ],
          }),
          compilerOptions: {
            module: 'esnext',
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
