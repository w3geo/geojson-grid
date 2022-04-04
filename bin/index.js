#!/usr/bin/env node

import GeoJSON from 'ol/format/GeoJSON.js';
import {fromLonLat, toLonLat, transformExtent} from 'ol/proj.js';
import parseArgs from 'minimist';
import { Feature } from 'ol';
import { Point } from 'ol/geom.js';

const argv = parseArgs(process.argv.slice(2));

if (!argv.bounds) {
  console.error('Missing bounds parameter.');
}
if (!argv.bounds) {
  console.error('Missing cellsize parameter.');
}
if (!argv.bounds || !argv.cellsize) {
  console.log('Usage: geojson-grid --bounds=<minx>,<miny>,<maxx>,<maxy> --cellsize=<meters>');
  process.exit(1);
}

const extent = transformExtent(argv.bounds.split(',').map(Number), 'EPSG:4326', 'EPSG:3857');
const cellsize = argv.cellsize
let coord = [extent[0] + cellsize / 2, extent[3] - cellsize / 2];
let features = [];
while (coord[0] < extent[2]) {
  while (coord[1] > extent[1]) {
    features.push(new Feature(new Point(coord)));
    coord[1] -= cellsize;
  }
  coord[0] += cellsize;
  coord[1] = extent[3] - cellsize / 2;
}
const geojson = new GeoJSON().writeFeaturesObject(features, {featureProjection: 'EPSG:3857'});
console.log(JSON.stringify(geojson, null, 2));