var express = require( 'express' );
var http = require( 'http' );

const serverPort = 8091;

var app, httpServer;

// Termination signal
process.on( "SIGINT", function() {

	console.log( " SIGINT Signal Received, shutting down." );
	process.exit( 0 );

} );


app = express();
httpServer = http.Server( app );
app.use( "/", express.static( "./" ) );

httpServer.listen( serverPort, function () { console.log( "Server started. Browse to: http://127.0.0.1:" + serverPort + "/dist/MinceSlicer.html"  ); } );
