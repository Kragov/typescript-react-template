const path = require("path");
const { base, prod, dev } = require("./webpack");
const { merge } = require("webpack-merge");

const PATHS = {
	src: path.join(__dirname, "src"),
	build: path.join(__dirname, "build"),
	public: path.join(__dirname, "public"),
	root: path.join(__dirname),
};

module.exports = (env) => {
	if (env.dev) {
		return merge(base({ PATHS }), dev({ PATHS }));
	}
	if (env.prod) {
		return merge(base({ PATHS }), prod({ PATHS }));
	}
	throw new Error("No matching configuration was found!");
};
