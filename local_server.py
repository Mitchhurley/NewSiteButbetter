import http.server
import socketserver
import os
import webbrowser
import threading
import time
import argparse
import sys
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler that logs requests to console."""
    
    def log_message(self, format, *args):
        """Custom log message that's more informative."""
        sys.stdout.write(f"\033[92m[{self.log_date_time_string()}] {self.address_string()} - {format % args}\033[0m\n")
    
    def do_GET(self):
        """Handle GET requests."""
        # If requesting directory root, redirect to index.html
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        
        # Let the parent method handle the response
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

def find_website_directory(directory):
    """Find the best directory to serve based on content."""
    # Check if the specified directory exists
    if not os.path.exists(directory):
        print(f"Error: Directory {directory} not found.")
        return None
    
    # If the directory contains index.html, return it
    if os.path.exists(os.path.join(directory, 'index.html')):
        return directory
    
    # Look for subdirectories with index.html
    for root, dirs, files in os.walk(directory):
        if 'index.html' in files:
            return root
    
    # If we can't find an index.html, look for any .html file
    for root, dirs, files in os.walk(directory):
        html_files = [f for f in files if f.endswith('.html')]
        if html_files:
            return root
    
    # If we still can't find any HTML files, return the original directory
    return directory

def start_server(directory, port=8000, open_browser=True):
    """Start a simple HTTP server in the specified directory."""
    # Find the best directory to serve
    serve_dir = find_website_directory(directory)
    if not serve_dir:
        return
    
    print(f"\nServing website from: {serve_dir}")
    os.chdir(serve_dir)
    
    # Create HTTP server with custom handler
    handler = CustomHTTPRequestHandler
    
    # Try to start the server on the specified port
    try:
        httpd = socketserver.TCPServer(("", port), handler)
    except OSError:
        # If port is in use, try another port
        print(f"Port {port} is in use. Trying another port...")
        port = 8080
        try:
            httpd = socketserver.TCPServer(("", port), handler)
        except OSError:
            # If that fails too, use a random port
            port = 0
            httpd = socketserver.TCPServer(("", port), handler)
    
    # Get the actual port (in case we used 0)
    actual_port = httpd.server_address[1]
    
    server_url = f"http://localhost:{actual_port}"
    print(f"Server started at {server_url}")
    print("Available pages:")
    
    # List available HTML pages
    html_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                rel_path = os.path.join(root, file)[2:].replace('\\', '/')
                html_files.append(rel_path)
                print(f"  {server_url}/{rel_path}")
    
    print("\nPress Ctrl+C to stop the server")
    
    # Open browser after a short delay if requested
    if open_browser:
        def open_browser():
            time.sleep(1)
            print("Opening browser...")
            webbrowser.open(server_url)
        
        threading.Thread(target=open_browser, daemon=True).start()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user.")
        httpd.shutdown()

def main():
    parser = argparse.ArgumentParser(description='Start a local web server for website testing')
    parser.add_argument('--dir', default='./cleaned_site', 
                        help='Directory containing the website files (default: ./cleaned_site)')
    parser.add_argument('--port', type=int, default=8000, 
                        help='Port to run the server on (default: 8000)')
    parser.add_argument('--no-browser', action='store_true',
                        help='Do not automatically open a browser')
    
    args = parser.parse_args()
    
    # Start the server
    start_server(args.dir, args.port, not args.no_browser)

if __name__ == "__main__":
    main()