var ndarray = require('ndarray');
var lerp = require('ndarray-linear-interpolate');

function flatten(data) {
  var tmp = new Array(data.length * 3);
  for(var i=0; i<data.length; i++) {
    tmp[i*3+0] = data[i][0];
    tmp[i*3+1] = data[i][1];
    tmp[i*3+2] = data[i][2];
  }
  return tmp;
}


function applyCubeLUT(dest, src, lut) {

  if(lut.type === '1D') {
    var shape = [lut.size, 3];
  } else { 
    // lut.type === '3D'
    var shape = [lut.size, lut.size, lut.size, 3];
  }

  var flat = flatten(lut.data);

  var grid = ndarray(flat, shape);
  var dmin = lut.domain[0];
  var dmax = lut.domain[1];

  for(y=0; y<src.shape[1]; y++) {
    for(x=0; x<src.shape[0]; x++) {
      var ri = src.get(x, y, 0);
      var gi = src.get(x, y, 1);
      var bi = src.get(x, y, 2);

      // map to domain
      ri = (ri - dmin[0]) / (dmax[0] - dmin[0]);
      gi = (gi - dmin[1]) / (dmax[1] - dmin[1]);
      bi = (bi - dmin[2]) / (dmax[2] - dmin[2]);

      // map to grid units
      ri = ri * (lut.size - 1);
      gi = gi * (lut.size - 1);
      bi = bi * (lut.size - 1);

      // clamp to grid bounds
      ri = ri < 0 ? 0 : (ri > (lut.size - 1) ? (lut.size - 1) : ri);
      gi = gi < 0 ? 0 : (gi > (lut.size - 1) ? (lut.size - 1) : gi);
      bi = bi < 0 ? 0 : (bi > (lut.size - 1) ? (lut.size - 1) : bi);

      if(lut.type === '1D') {
        var ro = lerp(grid, ri, 0);
        var go = lerp(grid, gi, 1);
        var bo = lerp(grid, bi, 2);
      } else {
        // lut.type === '3D'
        // Note `bi` is the fastest changing component
        var ro = lerp(grid, bi, gi, ri, 0);
        var go = lerp(grid, bi, gi, ri, 1);
        var bo = lerp(grid, bi, gi, ri, 2);
      }

      dest.set(x, y, 0, ro);
      dest.set(x, y, 1, go);
      dest.set(x, y, 2, bo);
    }
  }

  return dest;
}

module.exports = applyCubeLUT;