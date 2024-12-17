const { Color } = Cesium;
const { defaultValue } = Cesium;
const { defined } = Cesium;
const { Event } = Cesium;
const { WebMercatorTilingScheme, GeographicTilingScheme } = Cesium;

/**
 * @typedef {object} TileCoordinatesImageryProvider.ConstructorOptions
 *
 * Initialization options for the TileCoordinatesImageryProvider constructor
 *
 * @property {TilingScheme} [tilingScheme=new GeographicTilingScheme()] The tiling scheme for which to draw tiles.
 * @property {Ellipsoid} [ellipsoid] The ellipsoid.  If the tilingScheme is specified,
 *                    this parameter is ignored and the tiling scheme's ellipsoid is used instead. If neither
 *                    parameter is specified, the WGS84 ellipsoid is used.
 * @property {Color} [color=Color.YELLOW] The color to draw the tile box and label.
 * @property {number} [tileWidth=256] The width of the tile for level-of-detail selection purposes.
 * @property {number} [tileHeight=256] The height of the tile for level-of-detail selection purposes.
 */

/**
 * An {@link ImageryProvider} that draws a box around every rendered tile in the tiling scheme, and draws
 * a label inside it indicating the X, Y, Level coordinates of the tile.  This is mostly useful for
 * debugging terrain and imagery rendering problems.
 *
 * @alias TileCoordinatesImageryProvider
 * @constructor
 *
 * @param {TileCoordinatesImageryProvider.ConstructorOptions} [options] Object describing initialization options
 */
function TileCoordinatesImageryProvider(options) {
  options = defaultValue(options, defaultValue.EMPTY_OBJECT);

  this._tilingScheme = defined(options.tilingScheme)
    ? options.tilingScheme
    : new GeographicTilingScheme({ ellipsoid: options.ellipsoid });
  this._color = defaultValue(options.color, Color.YELLOW);
  this._errorEvent = new Event();
  this._tileWidth = defaultValue(options.tileWidth, 256);
  this._tileHeight = defaultValue(options.tileHeight, 256);

  this._defaultAlpha = undefined;
  this._defaultNightAlpha = undefined;
  this._defaultDayAlpha = undefined;
  this._defaultBrightness = undefined;
  this._defaultContrast = undefined;
  this._defaultHue = undefined;
  this._defaultSaturation = undefined;
  this._defaultGamma = undefined;
  this._defaultMinificationFilter = undefined;
  this._defaultMagnificationFilter = undefined;
}

Object.defineProperties(TileCoordinatesImageryProvider.prototype, {
  /**
   * Gets the proxy used by this provider.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {Proxy}
   * @readonly
   */
  proxy: {
    get: function () {
      return undefined;
    },
  },

  /**
   * Gets the width of each tile, in pixels.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {number}
   * @readonly
   */
  tileWidth: {
    get: function () {
      return this._tileWidth;
    },
  },

  /**
   * Gets the height of each tile, in pixels.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {number}
   * @readonly
   */
  tileHeight: {
    get: function () {
      return this._tileHeight;
    },
  },

  /**
   * Gets the maximum level-of-detail that can be requested.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {number|undefined}
   * @readonly
   */
  maximumLevel: {
    get: function () {
      return undefined;
    },
  },

  /**
   * Gets the minimum level-of-detail that can be requested.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {number}
   * @readonly
   */
  minimumLevel: {
    get: function () {
      return undefined;
    },
  },

  /**
   * Gets the tiling scheme used by this provider.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {TilingScheme}
   * @readonly
   */
  tilingScheme: {
    get: function () {
      return this._tilingScheme;
    },
  },

  /**
   * Gets the rectangle, in radians, of the imagery provided by this instance.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {Rectangle}
   * @readonly
   */
  rectangle: {
    get: function () {
      return this._tilingScheme.rectangle;
    },
  },

  /**
   * Gets the tile discard policy.  If not undefined, the discard policy is responsible
   * for filtering out "missing" tiles via its shouldDiscardImage function.  If this function
   * returns undefined, no tiles are filtered.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {TileDiscardPolicy}
   * @readonly
   */
  tileDiscardPolicy: {
    get: function () {
      return undefined;
    },
  },

  /**
   * Gets an event that is raised when the imagery provider encounters an asynchronous error.  By subscribing
   * to the event, you will be notified of the error and can potentially recover from it.  Event listeners
   * are passed an instance of {@link TileProviderError}.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {Event}
   * @readonly
   */
  errorEvent: {
    get: function () {
      return this._errorEvent;
    },
  },

  /**
   * Gets the credit to display when this imagery provider is active.  Typically this is used to credit
   * the source of the imagery.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {Credit}
   * @readonly
   */
  credit: {
    get: function () {
      return undefined;
    },
  },

  /**
   * Gets a value indicating whether or not the images provided by this imagery provider
   * include an alpha channel.  If this property is false, an alpha channel, if present, will
   * be ignored.  If this property is true, any images without an alpha channel will be treated
   * as if their alpha is 1.0 everywhere.  Setting this property to false reduces memory usage
   * and texture upload time.
   * @memberof TileCoordinatesImageryProvider.prototype
   * @type {boolean}
   * @readonly
   */
  hasAlphaChannel: {
    get: function () {
      return true;
    },
  },
});

/**
 * Gets the credits to be displayed when a given tile is displayed.
 *
 * @param {number} x The tile X coordinate.
 * @param {number} y The tile Y coordinate.
 * @param {number} level The tile level;
 * @returns {Credit[]} The credits to be displayed when the tile is displayed.
 */
TileCoordinatesImageryProvider.prototype.getTileCredits = function (
  x,
  y,
  level
) {
  return undefined;
};

/**
 * Requests the image for a given tile.
 *
 * @param {number} x The tile X coordinate.
 * @param {number} y The tile Y coordinate.
 * @param {number} level The tile level.
 * @param {Request} [request] The request object. Intended for internal use only.
 * @returns {Promise<HTMLCanvasElement>} The resolved image as a Canvas DOM object.
 */
TileCoordinatesImageryProvider.prototype.requestImage = function (
  x,
  y,
  level,
  request
) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  const cssColor = this._color.toCssColorString();

  // context.strokeStyle = cssColor;
  // context.lineWidth = 2;
  // context.strokeRect(1, 1, 255, 255);

  // context.font = "bold 25px Arial";
  // context.textAlign = "center";
  // context.fillStyle = cssColor;
  // context.fillText(`L: ${level}`, 124, 86);
  // context.fillText(`X: ${x}`, 124, 136);
  // context.fillText(`Y: ${y}`, 124, 186);

  window.m3tDegreeToHumanFormat =
    window.m3tDegreeToHumanFormat ??
    function m3tDegreeToHumanFormat(degree, posSuffix = "N", negSuffix = "S") {
      const abs = Math.abs(degree);
      const deg = Math.floor(abs);
      const min = Math.floor((abs - deg) * 60);
      // const sec = Math.floor(((abs - deg) * 60 - min) * 60);
      const sec = (((abs - deg) * 60 - min) * 60).toFixed(3);
      return `${deg}°${min}'${sec}" ${degree >= 0 ? posSuffix : negSuffix}`;
    };

  // 地球半径（单位：米），Web Mercator投影常用的地球半径取值
  const R = 6378137;

  // 反算经度的函数
  window.webMercatorXToLon =
    window.webMercatorXToLon ??
    function webMercatorXToLon(x) {
      return (x / R) * (180 / Math.PI);
    };

  // 反算纬度的函数
  window.webMercatorYToLat =
    window.webMercatorYToLat ??
    function webMercatorYToLat(y) {
      return (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
    };

  const [longitude, latitude] = (() => {
    if (this._tilingScheme instanceof GeographicTilingScheme) {
      const gridDegree = 180 * Math.pow(2, -level);
      const longitude = -180 + gridDegree * (x + 1);
      const latitude = 90 - gridDegree * (y + 1);
      return [longitude, latitude];
    }

    // 以下计算不对
    // const m = 85.05112877980659;
    // const latitude = m - m * 2 * Math.pow(2, -level) * (y + 1);
    // const longitude = -180 + 180 * 2 * Math.pow(2, -level) * (x + 1);
    // WebMercato在不同层级的经纬度计算方法
    const webMercatorGridSize = R * Math.PI * 2 * Math.pow(2, -level);
    const webMercatorX = -(R * Math.PI) + webMercatorGridSize * (x + 1);
    const webMercatorY = R * Math.PI - webMercatorGridSize * (y + 1);
    const longitude = window.webMercatorXToLon(webMercatorX);
    const latitude = window.webMercatorYToLat(webMercatorY);

    return [longitude, latitude];
  })();

  context.fillStyle = "white";
  context.font = "24px Arial";
  context.textAlign = "center";

  context.fillText(`${window.m3tDegreeToHumanFormat(latitude)}`, 256, 512 - 6);

  context.save();
  context.translate(512, 256);
  context.rotate(-Math.PI * 0.5);
  context.fillText(
    `${window.m3tDegreeToHumanFormat(longitude, "E", "W")}`,
    0,
    -6
  );
  context.restore();

  return Promise.resolve(canvas);
};

/**
 * Picking features is not currently supported by this imagery provider, so this function simply returns
 * undefined.
 *
 * @param {number} x The tile X coordinate.
 * @param {number} y The tile Y coordinate.
 * @param {number} level The tile level.
 * @param {number} longitude The longitude at which to pick features.
 * @param {number} latitude  The latitude at which to pick features.
 * @return {undefined} Undefined since picking is not supported.
 */
TileCoordinatesImageryProvider.prototype.pickFeatures = function (
  x,
  y,
  level,
  longitude,
  latitude
) {
  return undefined;
};


window.GridLabelTileCoordinatesImageryProvider = TileCoordinatesImageryProvider;