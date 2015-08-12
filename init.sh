#!/bin/bash

# create database
echo "CREATE DATABASE snap;" | psql
echo "CREATE EXTENSION IF NOT EXISTS PostGIS;" | psql --dbname snap

# load sample data
  # if intalled, can also run ogr2ogr to load bulk data: http://www.gdal.org/drv_geojson.html

  # how to fake credentials?

# coordinates=(
#   '[ -122.426536560196979, 37.790584627350285 ]'
#   '[ -122.461901654655492, 37.771520631118747 ]'
#   '[ -122.423773662192403, 37.784506251740233 ]'
#   '[ -122.395315812745324, 37.732840059054745 ]'
#   '[ -122.440074760419378, 37.738089565263429 ]'
#   '[ -122.440903629820752, 37.741405042868919 ]'
#   '[ -122.418800445784186, 37.787269149744802 ]'
#   '[ -122.485662577494807, 37.828988909613827 ]'
# )

# for coordinate in ${coordinates[*]}; do
#   curl --data "geo=${coordinate}" http://localhost:8000/physical
# done
