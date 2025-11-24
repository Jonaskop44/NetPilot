#!/bin/sh

host="$1"
shift

echo "Waiting for DB at $host..."

while ! nc -z "$host" 5432; do
  echo "DB not reachable, waiting..."
  sleep 2
done

echo "DB is reachable, starting server..."

exec "$@"