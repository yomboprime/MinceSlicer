const path = require('path');

module.exports = {
	entry: './src/index.js',
	mode: 'production',
	//mode: 'development',
	devtool: 'inline-source-map',
	optimization: {
		minimize: false,
	},
	output: {
		filename: 'main.js',
		path: path.resolve( __dirname, 'dist' ),
	}
};
