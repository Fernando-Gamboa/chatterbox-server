/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

// create messages variable to store message from POST ---
const messages = [];


var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 404;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  // change to application/json content type ---
  headers['Content-Type'] = 'application/json';


  // if response.url is /client/messages
  if (request.url === '/classes/messages') {
    // if reponse.method is POST
    if (request.method === 'POST') {
      // create empty body variable string
      let body = '';
      // set status code to 201
      statusCode = 201;
      // no user name set to false
      let noUserName = false;
      // no text set to false
      let noText = false;
      // on request.on data function
      request.on('data', (chunk) => {
        // we want to add chunks of data as string to body
        body += chunk.toString();
      });
      // on request.on end
      request.on('end', () => {
        // we assign body as parsed object into singleMsg
        let singleMsg = JSON.parse(body);
        // if singleMsg username is undefined
        if (singleMsg.username === undefined) {
          // no user name equals true
          noUserName = true;
          console.log('noUserName should be true--------', noUserName);
        }
        // if singleMsg text is undefined
        if (singleMsg.text === undefined) {
          // no text is true
          noText = true;
          console.log('noText should be true----------', noText);
        }
        // if no user name OR no text are true
        if (noUserName || noText) {
          console.log('AM I ENTERING HERE? ------------------');
          // set status code to 404
          statusCode = 404;
        }
        // push the body parsed object into messages array
        messages.push(JSON.parse(body));
        // set a response writeHead with status code and headers
        response.writeHead(statusCode, headers);
        // do a response end with a stringify status code
        response.end(JSON.stringify(statusCode));
      });

    } else if (request.method === 'GET') { // else if response.method is GET
      // statusCode to 200
      statusCode = 200;
    }
  }


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  // if reponse method is GET
  if (request.method === 'GET') {
    // do a response end with messages array stringified
    response.end(JSON.stringify(messages));
  }
  // if response emthod is DELETE
  if (request.method === 'DELETE') {
    // do a response end with status code stringified
    response.end(JSON.stringify(statusCode));
  }
};


// export the requestHandler function ---
module.exports.requestHandler = requestHandler;