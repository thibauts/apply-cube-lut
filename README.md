apply-cube-lut
==============
### Apply a Cube (IRIDAS/Adobe) LUT to an image

Applies a Cube LUT to an image. See [parse-cube-lut](https://github.com/thibauts/parse-cube-lut) for Cube LUT parsing.

LUT files are useful for color grading, encapsulating complex color-space transforms or emulating film stock for photography and video.

Example
-------

Photograph transformed with a Fuji 400h stock emulation LUT.

<img src="http://i.imgur.com/tebHX4X.jpg" /><img src="http://i.imgur.com/AaLmDyg.jpg" />

Install
-------

```bash
$ npm install apply-cube-lut
```

Usage
-----

```javascript
var applyCubeLUT = require('apply-cube-lut');
var parseCubeLUT = require('parse-cube-lut');
var ndarrayFromImage  = require('ndarray-from-image');
var canvasFromNdarray = require('canvas-from-ndarray');
var ops = require('ndarray-ops');

var lutURL = 'test.cube';
var imgURL = 'test.jpg';

var req = new XMLHttpRequest();
var img = new Image();

req.onload = function() {
  img.onload = function() {

    // once both the image and LUT data are loaded
    var lut = parseCubeLUT(req.responseText);
    var arr = ndarrayFromImage(img, 'float32');

    // convert RGBA components to 0.0 -> 1.0
    ops.mulseq(arr, 1.0 / 255.0);

    // apply LUT
    applyCubeLUT(arr /* dest */, arr /* src */, lut);

    // convert back to 0.0 -> 255.0
    ops.mulseq(arr, 255.0);

    // display transformed image
    var canvas = canvasFromNdarray(arr);
    document.body.appendChild(canvas);
  };
  
  img.src = imgURL;
};

req.open('GET', lutURL, true);
req.send();
```