#!/bin/sh -e

echo "fetching"
wget https://github.com/DanielJDufour/geojson-test-data/archive/9ae3c01dd061025a47b23fd76d676e6b11526166.zip -O geojson-test-data.zip

echo "unzipping"
unzip -j -o geojson-test-data.zip "geojson-test-data-*/files/*" -d .

mkdir -p geojson

mv *.geojson ./geojson/.

echo "cleaning"
rm geojson-test-data.zip
