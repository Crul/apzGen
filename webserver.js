 var express = require("express");
 var app = express();

 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params[0]);
     res.sendfile("bin/" + req.params[0]); 
 });

 var port = 80;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });