function calcPosFromLatLonRad(lat, lon, radius) {
  var phi = (90 - lat) * (Math.PI / 180);
  var theta = (lon + 180) * (Math.PI / 180);

  x = -(radius * Math.sin(phi) * Math.cos(theta));
  z = radius * Math.sin(phi) * Math.sin(theta);
  y = radius * Math.cos(phi);

  console.log([x, y, z]);
  return [x, y, z];
}

var THREEx = THREEx || {};

THREEx.Planets = {};

THREEx.Planets.baseURL = '../';

THREEx.Planets.createRandomPoints = function () {
  meshes = [];
  for (var i = 0; i < 10; i++) {
    var geometry = new THREE.SphereGeometry(0.025, 20, 20);
    var material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('white'),
    });
    var mesh = new THREE.Mesh(geometry, material);
    meshes.push(mesh);
  }

  return meshes;
};

THREEx.Planets.createEarth = function () {
  var geometry = new THREE.SphereGeometry(0.3, 32, 32);
  var material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('http://i.imgur.com/puZgGjm.jpg'),
  });
  var mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

var renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('viewDiv').appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;

var updateFcts = [];
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
camera.position.z = 1.5;

var light = new THREE.AmbientLight(0x888888);
scene.add(light);
// var light	= new THREE.DirectionalLight( 'white', 1)
// light.position.set(5,5,5)
// light.target.position.set( 0, 0, 0 )
// scene.add( light )

var light = new THREE.DirectionalLight(0xcccccc, 1);
light.position.set(5, 5, 5);
scene.add(light);
light.castShadow = true;
light.shadowCameraNear = 0.01;
light.shadowCameraFar = 15;
light.shadowCameraFov = 45;

light.shadowCameraLeft = -1;
light.shadowCameraRight = 1;
light.shadowCameraTop = 1;
light.shadowCameraBottom = -1;
// light.shadowCameraVisible	= true

light.shadowBias = 0.001;
light.shadowDarkness = 0.2;

light.shadowMapWidth = 1024 * 2;
light.shadowMapHeight = 1024 * 2;

//////////////////////////////////////////////////////////////////////////////////
//		Add Earth to Scene								//
//////////////////////////////////////////////////////////////////////////////////

var mesh = THREEx.Planets.createEarth();
scene.add(mesh);
currentMesh = mesh;

latlons = [
  [40.71427, -74.00597],
  [52.52437, 13.41053],
];
// function addPoints() {
//   var meshes = THREEx.Planets.createRandomPoints();
//   for (var i = 0; i < meshes.length; i++) {
//     mesh = meshes[i];
//     currentMesh.add(mesh);

//     latlon = latlons[Math.floor(Math.random() * latlons.length)];

//     latlonpoint = calcPosFromLatLonRad(latlon[0], latlon[1], 0.5);
//     mesh.position = new THREE.Vector3(
//       latlonpoint[0],
//       latlonpoint[1],
//       latlonpoint[2]
//     );
//   }
// }

// addPoints();

//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
var mouse = { x: 0, y: 0 };
document.addEventListener(
  'mousemove',
  function (event) {
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = event.clientY / window.innerHeight - 0.5;
  },
  false
);
updateFcts.push(function (delta, now) {
  currentMesh.rotation.y -= mouse.x * 3 * (delta * 3);

  if (currentMesh.rotation.x <= 1 && currentMesh.rotation.x >= -1) {
    currentMesh.rotation.x -= mouse.y * 3 * (delta * 3);
  }
  if (currentMesh.rotation.x >= 1) {
    currentMesh.rotation.x += mouse.y * 3 * (delta * 3);
  }
  if (currentMesh.rotation.x <= -1) {
    currentMesh.rotation.x += mouse.y * 3 * (delta * 3);
  }

  camera.lookAt(scene.position);
});

updateFcts.push(function () {
  renderer.render(scene, camera);
});

//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
var lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate);
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec = nowMsec;
  // call each update function
  updateFcts.forEach(function (updateFn) {
    updateFn(deltaMsec / 1000, nowMsec / 1000);
  });
});
