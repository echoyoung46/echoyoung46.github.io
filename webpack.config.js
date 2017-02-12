var webpack = require('webpack');

module.exports = {
  entry: {
    home: './static/js/home.js',
    post: './static/js/post.js',
    vendor: ['swiper']
  },
  output: {
    filename: './static/js/[name].entry.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'static/js/vendor.js')
  ]
};