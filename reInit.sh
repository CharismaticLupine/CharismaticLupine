#!/bin/bash
set -e
echo "DROP DATABASE IF EXISTS snap;" | psql
bash init.sh
