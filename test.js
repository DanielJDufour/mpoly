const fs = require("fs");
const test = require("flug");

const mpoly = require("./mpoly.js");

const load_json = (dirpath, obj) => {
  return fs
    .readdirSync(dirpath)
    .filter(fp => fp.endsWith("json"))
    .reduce((acc, it) => {
      acc[it.split(".")[0].replaceAll(" ", "_")] = JSON.parse(fs.readFileSync(dirpath + "/" + it, "utf-8"));
      return acc;
    }, obj || {});
};

const geojsons = {};
load_json("./test-data/geojson", geojsons);
load_json("./test-data/gadm/arcgis", geojsons);

const arcgisjsons = load_json("./test-data/gadm/arcgis");

const { Example, GeometryCollection, LineString, MultiPoint, MultiLineString, MultiPolygon, MultiPolygonWithHole, Point, Polygon, PolygonWithHole } = geojsons;

test("mpoly.get (arcgis)", ({ eq }) => {
  Object.entries(arcgisjsons).forEach(([name, data]) => {
    eq(mpoly.get(arcgisjsons[name]), mpoly.get(geojsons[name]));
  });
});

test("mpoly.get (geojson)", ({ eq }) => {
  eq(mpoly.get(Example), [
    [
      [
        [100, 0],
        [101, 0],
        [101, 1],
        [100, 1],
        [100, 0]
      ]
    ]
  ]);
  eq(mpoly.get(GeometryCollection), [
    [
      [
        [40, 40],
        [20, 45],
        [45, 30],
        [40, 40]
      ]
    ]
  ]);
  eq(mpoly.get(LineString), []);
  eq(mpoly.get(MultiLineString), []);
  eq(mpoly.get(MultiPoint), []);
  eq(mpoly.get(MultiPolygon), [
    [
      [
        [30, 20],
        [45, 40],
        [10, 40],
        [30, 20]
      ]
    ],
    [
      [
        [15, 5],
        [40, 10],
        [10, 20],
        [5, 10],
        [15, 5]
      ]
    ]
  ]);
  eq(mpoly.get(MultiPolygonWithHole), [
    [
      [
        [40, 40],
        [20, 45],
        [45, 30],
        [40, 40]
      ]
    ],
    [
      [
        [20, 35],
        [10, 30],
        [10, 10],
        [30, 5],
        [45, 20],
        [20, 35]
      ],
      [
        [30, 20],
        [20, 15],
        [20, 25],
        [30, 20]
      ]
    ]
  ]);
  eq(mpoly.get(Point), []);
  eq(mpoly.get(Polygon), [
    [
      [
        [30, 10],
        [40, 40],
        [20, 40],
        [10, 20],
        [30, 10]
      ]
    ]
  ]);
  eq(mpoly.get(PolygonWithHole), [
    [
      [
        [35, 10],
        [45, 45],
        [15, 40],
        [10, 20],
        [35, 10]
      ],
      [
        [20, 30],
        [35, 35],
        [30, 20],
        [20, 30]
      ]
    ]
  ]);
});
