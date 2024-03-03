const config = {
  mode: "production",

  entry: {
    index: "./app/js/index.js",
    contacts: "./app/js/contacts.js",
    spoiler: "./app/js/spoiler.js",
  },

  output: {
    filename: "[name].bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/,

        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

module.exports = config;
