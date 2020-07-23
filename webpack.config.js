const path = require("path");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const { CheckerPlugin } = require("awesome-typescript-loader");
// const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    const isDevelopment = argv.mode === "development";
    return {
        entry: `./src/index.tsx`,
        devServer: {
            historyApiFallback: true,
            hot: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        },
        resolve: {
            alias: {
                //Duplicate aliases to tsconfig
                "@src": path.resolve(__dirname, "src"),
            },
            extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".scss"],
        },
        devtool: isDevelopment ? "eval-cheap-module-source-map" : undefined,
        output: {
            path: path.resolve(__dirname, "./build"),
            publicPath: "/",
            filename: isDevelopment ? `[name].js` : `[name].[hash].js`,
            sourceMapFilename: isDevelopment ? `[name].js.map` : `[name].[hash].js.map`,
        },
        module: {
            rules: [
                {
                    test: /\.js[x]?$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"],
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
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
                        isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
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
                    exclude: /\.module\.(sa|sc)ss$/,
                    use: [
                        "css-hot-loader",
                        isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: isDevelopment,
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
                                sourceMap: isDevelopment,
                            },
                        },
                    ],
                },
                {
                    test: /\.(jp(e*)g|png|gif|ico)$/,
                    include: [path.resolve(__dirname, "src/assets/images/")],
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: isDevelopment ? "[name].[ext]" : "[name].[ext]?[hash]",
                                outputPath: "assets/images/",
                            },
                        },
                    ],
                },
                {
                    test: /.*\.svg$/,
                    include: [path.resolve(__dirname, "src/assets/images/")],
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: isDevelopment ? "[name].[ext]" : "[name].[ext]?[hash]",
                                outputPath: "assets/images/",
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    include: [path.resolve(__dirname, "src/assets/fonts/")],
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]",
                                outputPath: "assets/fonts/",
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
                template: "public/index.html",
                favicon: "public/favicon.ico",
                filename: "index.html",
                title: "Typescript React Webpack Template",
                hash: !isDevelopment,
            }),
            new MiniCssExtractPlugin({
                filename: isDevelopment ? "[name].css" : "[name].[hash].css",
                chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
            }),
            // new CopyPlugin([
            //     {
            //         from: "public/.htaccess",
            //         to: ".htaccess",
            //         toType: "file",
            //     },
            // ]),
            new CheckerPlugin(),
            new ErrorOverlayPlugin(),
            new DotEnv(),
        ],
    };
};
