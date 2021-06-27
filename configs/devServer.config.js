const path = require('path')

module.exports = {
    contentBase: path.resolve(__dirname, '../static'),
    host: 'localhost',
    port: 3000,
    compress: true,
    historyApiFallback: true,
    hot: true,
    inline: true,
    open: true,
}
