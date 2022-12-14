const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base');

module.exports = merge(webpackBaseConfig, {
	mode: 'production',
	output: {
		filename: '[name].[chunkhash].bundle.js',
		chunkFilename: '[name].[chunkhash].chunk.js',
		path: path.resolve(__dirname, '../build'),
		publicPath: '/',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				/**
				 * No `ts-loader` since we need faster build speed.
				 */
				use: ['babel-loader'],
				exclude: /node_modules/,
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(__dirname, '../src/index.ejs'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new CssMinimizerPlugin(),
	],
});
