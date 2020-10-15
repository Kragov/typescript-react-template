module.exports = ({ PATHS }) => ({
	entry: `${PATHS.src}/index.tsx`,
	externals: {
		PATHS,
	},
	resolve: {
		alias: {
			//DUPLICATE ALIASES TO TSCONFIG!!!
			src: PATHS.src,
			"@components": `${PATHS.src}/components`,
		},
		extensions: [".js", ".jsx", ".ts", ".tsx"],
	},
});
