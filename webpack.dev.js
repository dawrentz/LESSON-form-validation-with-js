const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development", 
    devtool: "inline-source-map",
    devServer: {
        static: "./dist",
        watchFiles: ["./src/template.html"],
        client: {
            logging: "none", //disable HMR logs
            // overlay: false,  //disable error overlay
        },
    },
});