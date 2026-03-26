/**
 * Polyfills for running pdfjs-dist v5 in Node.js.
 * Load via: node --require ./test-corpus/node-polyfills.cjs
 */

// DOMMatrix polyfill
if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrixPoly {
    constructor(init) {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
      this.m11 = 1; this.m12 = 0; this.m13 = 0; this.m14 = 0;
      this.m21 = 0; this.m22 = 1; this.m23 = 0; this.m24 = 0;
      this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
      this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;
      this.is2D = true;
      this.isIdentity = true;
      if (Array.isArray(init) && init.length === 6) {
        this.a = init[0]; this.b = init[1]; this.c = init[2];
        this.d = init[3]; this.e = init[4]; this.f = init[5];
        this.m11 = this.a; this.m12 = this.b;
        this.m21 = this.c; this.m22 = this.d;
        this.m41 = this.e; this.m42 = this.f;
      }
    }
    scale() { return new DOMMatrixPoly(); }
    translate() { return new DOMMatrixPoly(); }
    multiply() { return new DOMMatrixPoly(); }
    inverse() { return new DOMMatrixPoly(); }
    transformPoint(p) {
      return { x: (p && p.x) || 0, y: (p && p.y) || 0, z: 0, w: 1 };
    }
    static fromMatrix() { return new DOMMatrixPoly(); }
    static fromFloat64Array() { return new DOMMatrixPoly(); }
    static fromFloat32Array() { return new DOMMatrixPoly(); }
  }
  globalThis.DOMMatrix = DOMMatrixPoly;
}

// Path2D polyfill
if (typeof globalThis.Path2D === 'undefined') {
  class Path2DPoly {
    moveTo() {}
    lineTo() {}
    bezierCurveTo() {}
    quadraticCurveTo() {}
    arc() {}
    arcTo() {}
    ellipse() {}
    rect() {}
    closePath() {}
    addPath() {}
  }
  globalThis.Path2D = Path2DPoly;
}

// ImageData polyfill (minimal)
if (typeof globalThis.ImageData === 'undefined') {
  class ImageDataPoly {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.data = new Uint8ClampedArray(width * height * 4);
    }
  }
  globalThis.ImageData = ImageDataPoly;
}
