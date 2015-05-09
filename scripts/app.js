/*
 * Proyecto 5 - Gráficas
 * Jorge Lainfiesta 11142
 */

requirejs.config({
  baseUrl: 'scripts/lib',
  paths: {
    app: '../app',
    three: 'three',
    threeCore: 'three.min',
    OrbitControls: 'OrbitControls',
    JSARToolKit: 'JSARToolKit.min',
    JSARExtensions : 'JsArExtensions'
  },
  shim : {
    tour : ['jquery'],
    threeCore: {exports: 'THREE'},
    OrbitControls: { deps: ['threeCore'], exports: 'THREE' },
    JSARExtensions: {deps: ['threeCore'], exports: 'THREE' },
    
    JSARToolKit: {
      exports: 'FLARParam',
      init: function(){
        return {
          FLARParam: FLARParam,
          FLARMultiIdMarkerDetector: FLARMultiIdMarkerDetector,
          NyARRgbRaster_Canvas2D: NyARRgbRaster_Canvas2D,
          NyARTransMatResult: NyARTransMatResult
        }
      }
    }
  }
});

requirejs(['app/main']);