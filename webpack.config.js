var webpack = require('webpack');

module.exports = {
  entry: {
    app: './static/js/home.js',
    vendor: ['swiper']
  },
  output: {
    filename: './static/js/bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.js')
  ]
};