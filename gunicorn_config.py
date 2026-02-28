# Gunicorn configuration file
# Usage: gunicorn -c gunicorn_config.py app_production:app

import multiprocessing
import os

# Server socket
bind = "0.0.0.0:5000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = "logs/gunicorn_access.log"
errorlog = "logs/gunicorn_error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "nexthire"

# Server mechanics
daemon = False
pidfile = "gunicorn.pid"
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (if needed)
# keyfile = "path/to/keyfile"
# certfile = "path/to/certfile"

# Server hooks
def on_starting(server):
    print("Gunicorn server is starting...")

def on_reload(server):
    print("Gunicorn server is reloading...")

def when_ready(server):
    print(f"Gunicorn server is ready. Listening on: {bind}")

def on_exit(server):
    print("Gunicorn server is shutting down...")
