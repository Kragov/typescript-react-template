const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.tsx",
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	output: {
		path: path.join(__dirname, "/build"),
		filename: "bundle.min.js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "awesome-typescript-loader",
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			favicon: "./public/favicon.ico",
		}),
	],
};
