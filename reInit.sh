#!/bin/bash
echo "DROP DATABASE IF EXISTS snap;" | psql
bash init.sh
