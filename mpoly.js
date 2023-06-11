const meta = require("@turf/meta");
const booleanClockwise = require("@turf/boolean-clockwise").default;

function each(geom, callback) {
  // pre-processing steps
  if (typeof geom === "string") geom = JSON.parse(geom);

  if (typeof geom.geometry === "object" && Array.isArray(geom.geometry.rings)) {
    // convert esri to geojson polygons
    // ESRI JSON is a real pain here
    // exterior rings are clockwise
    // holes are counter-clockwise

    let current;
    geom.geometry.rings.forEach(ring => {
      if (booleanClockwise(ring)) {
        // new polygon, so push any existing rings
        if (current) callback(current);
        current = [ring];
      } else {
        current.push(ring);
      }
    });
    callback(current);
  } else if ("type" in geom) {
    meta.geomEach(geom, it => {
      if (it.type === "Polygon") {
        callback(it.coordinates);
      } else if (it.type === "MultiPolygon") {
        it.coordinates.forEach(polygon => {
          callback(polygon);
        });
      }
    });
  } else if (Array.isArray(geom)) {
    const depth = getDepth(geojson);
    if (depth === 4) {
      it.forEach(polygon => {
        callback(polygon);
      });
    } else if (depth === 3) {
      callback(it);
    }
  }
}

function get(it) {
  const polygons = [];
  each(it, polygon => polygons.push(polygon));
  return polygons;
}

module.exports = {
  each,
  get
};
