import { resolve } from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import sass from "sass";
import CopyWebpackPlugin from "copy-webpack-plugin";

type BuildEnv = {
  mode: string;
};

const createConfig = (env: BuildEnv) => {
  const isProd = env.mode === "prod";

  return {
    mode: isProd ? "production" : "development",

    output: { filename: "[name].js", path: resolve("build") },

    entry: {
      index: resolve("./src/index.tsx"),
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /(node_modules)/,
          use: ["babel-loader", "ts-loader"],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { attributes: false, minimize: true },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isProd
                    ? "[hash:8]"
                    : "[folder]-[local]-[hash:8]",
                  context: resolve("src"),
                },
                importLoaders: 2,
                sourceMap: true,
              },
            },
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                implementation: sass,
                sassOptions: { includePaths: ["node_modules"] },
              },
            },
          ],
        },
      ],
    },

    devtool: isProd ? undefined : "source-map",

    resolve: { extensions: [".js", ".ts", ".tsx"] },

    plugins: [
      new HTMLWebpackPlugin({ template: "src/index.html", inject: false }),
      new MiniCssExtractPlugin(),
      new CleanWebpackPlugin(),
      new HardSourceWebpackPlugin(),
      new HardSourceWebpackPlugin.ExcludeModulePlugin([
        { test: /mini-css-extract-plugin[\\/]dist[\\/]loader/ },
      ]),
      new CopyWebpackPlugin({
        patterns: [{ from: "src/assets", to: "assets" }],
      }),
    ],
  };
};

module.exports = (env: BuildEnv) => createConfig(env);
