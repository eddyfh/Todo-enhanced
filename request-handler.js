var ourUrl = require('url');

/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */


/* These headers will allow Cross-Origin Resource Sharing.
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
var roomObj = {};
roomObj.results = [];
var roomName;
var obj = {};
obj.results = [{username: 'username', text: 'message', roomname: 'room'}];


var handleRequest = function(request, response) {
  var urlObj = ourUrl.parse(request.url);
  console.log(urlObj.pathname);

//take the substring of pathname, and if there's classes/(dirname) then we're good
//otherwise throw 404 error
// /classes/messages
console.log('typeof url: ' + typeof urlObj.pathname);
var pathArray = urlObj.pathname.split("/");
if (pathArray[1] !== 'classes') {
  //404 error
  response.writeHead(404, headers);
  response.end();
  return;
} else {
  roomName = pathArray[2];
}
debugger;
  console.log('pathArray[1] is: ' + pathArray[1] + '. roomName is '+roomName);

  // if (urlObj.pathname !== '/1/classes/messages') {
  //   return 'error';
  // }
  /* Request is an http.ServerRequest object containing various data
   * about the client request - such as what URL the browser is
   * requesting. */
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode = 200;

//post request
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  if (request.method === 'POST') {
    var data = [];
    request.on('data', function(chunk){
      data.push(chunk);
    });
    request.on('end', function(){
      data = data.join('');
      // now we've got the data!
      data = JSON.parse(data);

      if (roomName !== "messages") {
        roomObj.results.unshift(data);
      } else {
        obj.results.unshift(data);
      }
      response.writeHead(201, headers);
      //response.end(JSON.stringify(obj));
      response.end();
    });
  } else if(request.method === 'GET') {
    //below is the get request
    if (roomName !== "messages") {
      //if room is selected
      debugger;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(roomObj.results));
    } else {
      //if no room is selected
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(obj));
    }

  } else if(request.method === 'OPTIONS'){
    // TODO: handle requests for method === 'OPTIONS'
    response.writeHead(200, headers);
    response.end();
  }else {
    // unkown HTTP method
    response.writeHead(405, headers);
    response.end("Unknown method: " + request.method);
  }
};

module.exports.handleRequest = handleRequest;