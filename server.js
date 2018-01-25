// ConnectEd Server

// Import the necessary Node modules.
var http = require('http');
var fs = require('fs');

// Create the server.
var myServer = http.createServer((req, res) => {

    // Generic function that sends files.
    function fetchFile(dir) {
        // Check file extension.
        if (dir.match(/.html$/)) {
            fs.readFile(dir, (err, data) => {
                sendPage(data.toString());
            });
        } else if(dir.match(/.css$/)){
            fs.readFile(dir, (err, data) => {
                sendCSS(data.toString());
            });
        } else if(dir.match(/.js$/)){
            console.log('JS needs to be sent.');
        }
    }

    /*
    function sendJS(){

    }
    */

    // Sends requested HTML files.
    function sendPage(view) {
        let count = 0;
        let partialDir = './partials/';
        let partialFiles = ['header.html', 'footer.html'];
        let pageParts = [];

        // Puts the view and the partials together. Right now only takes into account the header and footer partials.
        function makePage(i) {
            fs.readFile(partialDir + partialFiles[i], (err, data) => {
                pageParts[i] = data.toString();
                count++;
                if (count == 2) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(pageParts[0] + view + pageParts[1]);
                    res.end();
                }
            });
        }

        for (i = 0; i < partialFiles.length; i++) {
            makePage(i);
        }
    }

    // Sends requested CSS files.
    function sendCSS(css) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(css);
        res.end();
    }

    // Route the requests.
    switch (req.url) {
        case '/':
            fetchFile('./views/index.html');
            break;

        // TEMP: This is just for testing.
        case '/ls':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            getDirItems('.', sendPage);
            break;

        // Serve the web page.
        case '/courses':
            fetchFile('./views/courses.html');
            break;

        // Serve the CSS to go along with the web page. TODO: Make this more dynamic.
        case '/css/main.css':
            fetchFile('./css/main.css');
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page not found.');
            break;
    }

    // TEMP: Just to see how the server is reacting.
    console.log(req.url.toString());
});

// List all the items in a directory.
function getDirItems(dir, callback) {
    let body = '<ul>';
    fs.readdir(dir, (err, list) => {
        for (let i = 0; i < list.length; i++) {
            body += '<li>' + list[i] + '</li>';
        }

        body += '</ul>';
        callback(body);
    });
}

// Start the server.
const port = 3000;
myServer.listen(port);
console.log("Server started (port", port.toString() + ").", "Press CTRL+C to stop...");