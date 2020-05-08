const path = require('path');
const buildOutputPath = path.join(__dirname, 'dist');
const _ = require('lodash');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let config =  {
	context: `${__dirname}`,
	entry: ['./app'],
	devtool: 'cheap-module-eval-source-map',
	output: {
		path: buildOutputPath,
		filename: 'bundle.js',
	},
	resolve: {
		modules: [path.resolve('.'), 'node_modules'],
		extensions: ['.js', '.jsx'],
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				sourceMap: true,
			}),
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			_: 'lodash',
		}),
		new CopyWebpackPlugin([{ from: 'index.html' }, { from: 'definition.json' }, { from: 'fa-params.js' }]),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].[hash].css',
		}),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.optimize\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorPluginOptions: {
				preset: ['default', { discardComments: { removeAll: true } }],
			},
			canPrint: true,
		}),
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
				exclude: [/node_modules/],
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: {
					loader: 'file-loader',
					options: {
						esModule: false,
						name: '[hash].[ext]',
					},
				},
			},
			{
				test: /\.(jp(e)?g|png|gif)(\?[a-z0-9]+)?$/,
				use: {
					loader: 'file-loader',
					options: {
						esModule: false,
						name: '[name].[ext]',
					},
				},
			},
			{
				test: /\.svg$/,
				use: {
					loader: 'file-to-string-loader',
					options: {
						esModule: false,
						name: '[hash].[ext]',
						limit: 1000,
					},
				},
			},
		],
	},
};

module.exports = (env, argv) => {
	if (argv.mode === 'development') {
	  config.devtool = 'cheap-module-eval-source-map';
	}

	return config;
  };