const path = require("path");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const { CheckerPlugin } = require("awesome-typescript-loader");
const CopyPlugin = require("copy-webpack-plugin");

// noinspection DuplicatedCode
module.exports = ({ PATHS }) => ({
	mode: "production",
	output: {
		path: PATHS.build,
		publicPath: "/",
		filename: "[name]---[hash].js",
		sourceMapFilename: `[name]---[hash].js.map`,
	},
	module: {
		rules: [
			{
				test: /\.js[x]?$/,
				include: [PATHS.root, PATHS.src],
				exclude: [/node_modules/, /build/],
				use: ["babel-loader"],
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				include: [PATHS.root, PATHS.src],
				use: [
					{
						loader: "awesome-typescript-loader",
						options: {
							errorsAsWarnings: true,
						},
					},
				],
			},
			{
				test: /\.css$/,
				exclude: /\.module\.css$/,
				use: [
					"css-hot-loader",
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: [autoprefixer],
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(sa|sc)ss$/,
				include: PATHS.src,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							modules: {
								localIdentName: "[local]__@[hash:base64:10]",
							},
						},
					},
					{
						loader: "postcss-loader",
						options: {
							plugins: [autoprefixer],
							sourceMap: true,
						},
					},
					"sass-loader",
				],
			},
			{
				test: /\.(jp(e*)g|png|gif|ico)$/,
				include: path.join(PATHS.src, "assets/images"),
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]?[hash]",
							outputPath: "assets/images",
						},
					},
				],
			},
			{
				test: /.*\.svg$/,
				include: path.join(PATHS.src, "assets/images"),
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]?[hash]",
							outputPath: "assets/images",
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				include: [path.join(PATHS.src, "assets/fonts")],
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "assets/fonts",
						},
					},
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ["**/*", "!static-files*"],
		}),
		new HtmlWebpackPlugin({
			template: path.join(PATHS.public, "template.html"),
			favicon: path.join(PATHS.public, "favicon/favicon.ico"),
			filename: "index.html",
			title: "Landlord",
			hash: true,
		}),
		new MiniCssExtractPlugin({
			filename: "[name]---[hash].css",
			chunkFilename: "[id].[hash].css",
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.join(PATHS.public, ".htaccess"),
					to: ".htaccess",
					toType: "file",
				},
				{
					from: path.join(PATHS.public, "manifest.json"),
					to: "manifest.json",
					toType: "file",
					copyUnmodified: true,
				},
				{
					from: path.join(PATHS.public, "favicon"),
					to: "favicon",
				},
				{
					from: path.join(PATHS.public, "sw.js"),
					to: "sw.js",
					toType: "file",
					copyUnmodified: true,
				},
				{
					from: path.join(PATHS.public, "pwa-sw.js"),
					to: "pwa-sw.js",
					toType: "file",
					copyUnmodified: true,
				},
			],
		}),
		new CheckerPlugin(),
		new DotEnv(),
	],
});
