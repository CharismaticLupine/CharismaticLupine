#!/bin/bash

# create database
echo "CREATE DATABASE snap;" | psql
echo "CREATE EXTENSION IF NOT EXISTS PostGIS;" | psql --dbname snap
