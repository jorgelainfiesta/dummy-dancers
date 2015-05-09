define(['three', './scene', './renderer', './cameras', './data'], function (THREE, scene, renderer, cameras, data) {
  //Animate
  var controls = new THREE.OrbitControls(cameras.topView, renderer.domElement);
  
//  var loader = new THREE.JSONLoader;
//  var animation;
//  var done = false;
//  loader.load('models/Guy.json', function (geometry, materials) {
//    var mesh, material;
//    
//    // create a mesh
//    mesh = new THREE.Mesh(
//      geometry,
//      new THREE.MeshFaceMaterial(materials)
//    );
//    // define materials collection
////    material = mesh.material.materials;
//////    enable skinning
////    for (var i = 0; i < materials.length; i++) {
////      var mat = materials[i];
////      mat.skinning = true;
////    }
//    console.log(geometry.animations);
//    // create animation
//    animation = new THREE.Animation(
//      mesh,
//      geometry.animations[0]
//    );
////
////    // play the anim
//    animation.play();
////    mesh.scale(10, 10, 10);
//    mesh.scale.set(100, 100, 100);
//    scene.scene.add(mesh);
//
//    done  = true;
////    animate();
//  });
  
  
  var clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
//    if(done) {
//      animation.update(1);
//      console.log(animation.hierarchy  );
//    }
//    
    
//    controls.update();
//    renderer.render(scene.scene, cameras.topView);
//    
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene.inputScene, cameras.inputCamera);
    renderer.render(scene.overlayScene, cameras.overlayCamera);

    scene.update();
  }
  return {"animate" : animate};
});