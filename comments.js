// Create web server for comment to handle requests
// for comments.

// Import modules
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');

// Create server
http.createServer(function (req, res) {
    // Get URL
    const pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    // Handle POST requests
    if (req.method == 'POST') {
        // Handle form data
        if (pathname == '/process') {
            // Create empty string for data
            let body = '';

            // Get data from form
            req.on('data', function (data) {
                body += data;
            });

            // Process data from form
            req.on('end', function () {
                // Parse form data
                const form = qs.parse(body);

                // Write data to file
                fs.appendFileSync('comments.txt', form['name'] + '\n' + form['comment'] + '\n');

                // Redirect to comments page
                res.writeHead(303, { 'Location': '/comments' });
                res.end();
            });
        }
    }

    // Handle GET requests
    else if (req.method == 'GET') {
        // If request is for comments page
        if (pathname == '/comments') {
            // Read comments from file
            const comments = fs.readFileSync('comments.txt', 'utf8');

            // Create HTML page
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title>Comments</title></head><body>');
            res.write('<h1>Comments</h1>');
            res.write('<form action="/process" method="POST">');
            res.write('<p>Name: <input type="text" name="name"></p>');
            res.write('<p>Comment: <textarea name="comment" rows="5" cols="50"></textarea></p>');
            res.write('<p><input type="submit" value="Submit"></p>');
            res.write('</form>');
            res.write('<p>' + comments.replace(/\n/g, '<br>') + '</p>');
            res.write('</body></html>');
            res.end();
        }

        // If request is for stylesheet
        else if (pathname == '/styles.css') {
            // Read stylesheets
