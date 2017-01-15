var webpack = require('webpack');

module.exports = {
  entry: {
    app: './static/js/home.js'
  },
  output: {
    filename: './static/js/bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};