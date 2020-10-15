const path = require("path");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const { SourceMapDevToolPlugin } = require("webpack");
const { CheckerPlugin } = require("awesome-typescript-loader");
// const CopyPlugin = require("copy-webpack-plugin");

// noinspection DuplicatedCode
module.exports = ({ PATHS }) => ({
	mode: "development",
	devServer: {
		historyApiFallback: true,
		hot: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		overlay: true,
		open: true,
		host: "0.0.0.0",
		port: 8080,
		disableHostCheck: true,
		public: "http://localhost:8080",
	},
	devtool: "eval-cheap-module-source-map",
	output: {
		path: PATHS.build,
		publicPath: "/",
		filename: "[name].js",
		sourceMapFilename: "[file].map[query]",
		chunkFilename: "[id].[hash:8].js",
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
				include: PATHS.src,
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
				include: PATHS.src,
				exclude: /\.module\.css$/,
				use: [
					"css-hot-loader",
					"style-loader",
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
					"css-hot-loader",
					"style-loader",
					{
						loader: "css-loader",
						options: {
							sourceMap: true,
							modules: {
								localIdentName: "[local]__@[hash:base64:4]",
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
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /.*\.(jp(e*)g|png|gif|ico|svg)$/,
				include: path.join(PATHS.src, "assets/images"),
				use: [
					{
						loader: "file-loader",
						options: {
							outputPath: `assets/images`,
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				include: path.join(PATHS.src, "assets/fonts"),
				use: [
					{
						loader: "file-loader",
						options: {
							// name: '[name].[ext]',
							outputPath: `assets/fonts/`,
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
			template: path.join(PATHS.public, "index.html"),
			favicon: path.join(PATHS.public, "favicon.ico"),
			filename: "index.html",
			title: "React Typescript Webpack",
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
		// new CopyPlugin({
		// 	patterns: [
		// 		{
		// 			from: path.join(PATHS.public, ".htaccess"),
		// 			to: ".htaccess",
		// 			toType: "file",
		// 		},
		// 		{
		// 			from: path.join(PATHS.public, "manifest.json"),
		// 			to: "manifest.json",
		// 			toType: "file",
		// 		},
		// 		{
		// 			from: path.join(PATHS.public, "favicon"),
		// 			to: "favicon",
		// 		},
		// 		{
		// 			from: path.join(PATHS.public, "sw.js"),
		// 			to: "sw.js",
		// 			toType: "file",
		// 		},
		// 		{
		// 			from: path.join(PATHS.public, "pwa-sw.js"),
		// 			to: "pwa-sw.js",
		// 			toType: "file",
		// 		},
		// 	],
		// }),
		new CheckerPlugin(),
		new ErrorOverlayPlugin(),
		new DotEnv(),
		new SourceMapDevToolPlugin({
			filename: "[file].map[query]",
		}),
	],
});
