"use strict"

module.exports = splatPoints

var dirichlet = require("dirichlet")
var ndarray = require("ndarray")
var doSplat = require("cwise")({
  args: [
    "array",
    "array",
    "scalar",
    "scalar",
    "scalar"],
  pre: function(px, w, out, radius, dirichlet) {
    var os = out.shape
    this.nx = os[0]|0
    this.ir = Math.ceil(radius)|0
    this.min = Math.min
    this.max = Math.max
    this.floor = Math.floor
  },
  body: function(x, w, out, radius, dirichlet) {
    var ix = this.floor(x)|0
    var x0 = this.min(this.max(ix - this.ir, 0), this.nx)
    var x1 = this.min(this.max(ix + this.ir, 0), this.nx)

    //Splat point
    for(var i=x0; i<x1; ++i) {
      out.set(i, out.get(i) + w * dirichlet(this.nx, x-i))
    }
  }
})

//Splat a list of points to a grid with the given weights
function splatPoints(out, points, weights, radius) {
  doSplat(
    points,
    ndarray(weights.data,
      [weights.shape[0], 1],
      [weights.stride[0], 0],
      weights.offset),
    out,
    radius,
    dirichlet)
}
