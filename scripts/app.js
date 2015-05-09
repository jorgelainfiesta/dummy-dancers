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
    OrbitControls: 'OrbitControls'
  },
  shim : {
    tour : ['jquery'],
    threeCore: {exports: 'THREE'},
    OrbitControls: { deps: ['threeCore'], exports: 'THREE' }
  }
});

requirejs(['app/main']);