var EARTH_TEXTURE = '/img/base-earth.jpeg';
var TOGGLE_ROTATION = true;
//THREE.JS Script to render Earth, Moon and Geo-Stationary Satellites
//Camera, scene, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
scene.add(camera);
camera.position.set(0, 10, 70);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('earth-canvas').appendChild(renderer.domElement);

//Orbit Controls
var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

//Lighting Effects
var ambientLight = new THREE.AmbientLight(0xc1c1c1);
scene.add(ambientLight);

//Objects (Built with mesh using a geometry and a material)
//Add Sun with Sunflare
// var sunGeometry = new THREE.SphereGeometry(1, 50, 50);
// var sunMaterial = new THREE.MeshBasicMaterial({
//   map: new THREE.TextureLoader().load('../images/sun_texture.jpg'),
//   transparent: true,
//   opacity: 0.9,
//   side: THREE.DoubleSide,
// });
// var sun = new THREE.Mesh(sunGeometry, sunMaterial);
// sun.position.set(50, 50, -500); // set z to -500 to be behind the earth
// scene.add(sun);

// var sunflareGeometry = new THREE.PlaneGeometry(120, 120, 1, 1);
// var sunflareMaterial = new THREE.MeshBasicMaterial({
//   map: new THREE.TextureLoader().load('../images/lens_flare_sun_1024x1024.jpg'),
//   transparent: true,
//   opacity: 0.2,
//   blending: THREE.AdditiveBlending,
//   depthTest: false,
//   side: THREE.DoubleSide,
// });
// var sunflare = new THREE.Mesh(sunflareGeometry, sunflareMaterial);
// sunflare.position.set(sun.position.x, sun.position.y, sun.position.z - 1000);
// scene.add(sunflare);

// Earth-(Add the USRadioguy Daily Planet-Wide Composite https://usradioguy.com/daily-global-composite/ and elevation bumpmap)
var earthGeometry = new THREE.SphereGeometry(10, 50, 50);
var earthTexture = new THREE.TextureLoader().load(EARTH_TEXTURE);
var earthMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture, //Added date string so browser does not load old image
  color: 0xffffff,
  specular: 0x333333,
  shininess: 10,
  // bumpMap: new THREE.TextureLoader().load('../images/elev_bump_8192X4096.jpg'),
  // bumpScale: 0.3,
  // specularMap: new THREE.TextureLoader().load(
  //   '../images/earthspec8192X4096.jpg'
  // ),
  side: THREE.FrontSide, // enable backface culling
  depthWrite: true, // make earth solid
  transparent: false, // disable transparency
});
var earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add(earth);

// sunflare.position.z = earth.position.z - 50; // set sunflare behind the earth
// sun.position.z = earth.position.z - 51; // set sun behind the earth

// Make sunflare rotate slowly
// function animateSunflare() {
//   sunflare.rotation.z += 0.005; // Adjust the rotation speed as needed
// }

// Add this line to the render function
function render() {
  console.log('re-rendering');
  requestAnimationFrame(render);
  // animateSunflare();
  renderer.render(scene, camera);
}
render();

// Function to detect camera-geometry collisions with the USRADIOGUY Planetary Geo-Ring
function detectCollisions(camera, objects) {
  var raycaster = new THREE.Raycaster();
  var direction = camera.getWorldDirection(new THREE.Vector3());
  raycaster.set(camera.position, direction);
  var intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0 && intersects[0].distance < 1) {
    // Camera is colliding with an object
    if (
      intersects[0].object === earth &&
      camera.position.distanceTo(earth.position) < earth.geometry.radius
    ) {
      // Camera is inside the earth, move it back to previous position
      camera.position.copy(camera.userData.previousPosition);
    }
  } else {
    // No collisions, update previous position
    camera.userData.previousPosition.copy(camera.position);
  }
}

// Set initial previous position of camera for collision detection
camera.userData.previousPosition = new THREE.Vector3();
camera.userData.previousPosition.copy(camera.position);

// Add event listener for keyboard controls
window.addEventListener('keydown', function (event) {
  // ...
  // Handle other keyboard controls
  // ...

  // Check for collisions with earth mesh
  if (earth.userData.isCollidable) {
    detectCollisions(camera, [earth]);
  }
});

// Add event listener for mouse controls
window.addEventListener('mousemove', function (event) {
  // ...
  // Handle mouse controls
  // ...

  // Check for collisions with earth mesh
  if (earth.userData.isCollidable) {
    detectCollisions(camera, [earth]);
  }
});

// END OF THE EARTH CODE

//Create a line representing the orbit
// var toggleOrbitButton = document.getElementById('toggleOrbitButton');
// toggleOrbitButton.addEventListener('click', function () {
//   orbit.visible = !orbit.visible;
// });

// var orbitMaterial = new THREE.LineBasicMaterial({
//   color: 0x990000,
//   linewidth: 0.5,
// });
// var orbitGeometry = new THREE.CircleGeometry(25, 64);
// orbitGeometry.vertices.shift(); // remove the center point of the circle
// var orbit = new THREE.Line(orbitGeometry, orbitMaterial);
// orbit.rotation.x = Math.PI / 2;
// earth.add(orbit);

//Clouds (This is a bit complex, in a seperate process, a Java Script process downloads the latest VIIRS_NOAA20_Clear_Sky_Confidence_Day clear sky confidence from
//https://nasa-gibs.github.io/gibs-api-docs/available-visualizations/#visualization-product-catalog. The index.js script original came from https://github.com/matteason/daily-cloud-maps
//Finally an ImageMagick script creates a bit more transparency.
//The satellites tend not to capture the South Pole. To avoid harsh edges, a static image based on Blue Marble Clouds is overlaid
//on the bottom quarter of the live cloud map. This region isn't very visible on 3D images anyway,
//and most of the area is covered by the ice cap which makes the clouds even less visible.

// var toggleCloudButton = document.getElementById('toggleCloudButton');
// toggleCloudButton.addEventListener('click', function () {
//   clouds.visible = !clouds.visible;
// });

// var cloudGeometry = new THREE.SphereGeometry(10.1, 50, 50);
// var cloudMaterial = new THREE.MeshPhongMaterial({
//   map: new THREE.TextureLoader().load('../../GLOBAL/daily-clouds8192x4096.png'), //Downloaded from NASA GIBS VIIRS_NOAA20_Clear_Sky_Confidence_Day clear sky confidence
//   transparent: true,
//   opacity: 0.7,
// });
// var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
// //scene.add(clouds);
// earth.add(clouds); // will move together with earth

//GEOSTATIONARY SATELLITE SECTION -GOES16,18,EWS-G1,GK2A,HIMAWARI-9
//Geo-Stationary satellite placed accurately by coordinates ie 75.2Â°W, BUT do to rendering, a radius of orbit is used rather than actual geostationary orbit.

// const satelliteConfig = [
//   {
//     name: 'GOES-16',
//     longitude: 75.2,
//     image: '../images/GOES-R_(transparent).png',
//   },
//   {
//     name: 'GOES-18',
//     longitude: 137.2,
//     image: '../images/GOES-R_(transparent).png',
//   },
//   { name: 'EWS-G1', longitude: -61.3, image: '../images/goes-13.png' },
//   {
//     name: 'Himawari-9',
//     longitude: -140.7,
//     image: '../images/GOES-R_(transparent).png',
//   },
//   { name: 'GK-2A', longitude: -128.2, image: '../images/goes-13.png' },
//   { name: 'METEOSAT-9', longitude: -3.5, image: '../images/meteosat.png' },
//   { name: 'ELEKTRO-L 2', longitude: 14.5, image: '../images/elektro-l.png' },
//   { name: 'ELEKTRO-L 3', longitude: -76.0, image: '../images/elektro-l.png' },
//   { name: 'FENGYUN 4B', longitude: -133.1, image: '../images/FY_wx.png' },
//   { name: 'METEOSAT-10', longitude: -9.1, image: '../images/meteosat.png' },
// ];

// const satelliteGeometry = new THREE.PlaneGeometry(0.6, 0.3);
// const labelGeometry = new THREE.PlaneGeometry(1, 0.25);

// function createSatellite({ name, longitude, image }) {
//   const satelliteMaterial = new THREE.MeshPhongMaterial({
//     map: new THREE.TextureLoader().load(image),
//     color: 0xffffff,
//     transparent: true,
//     shininess: 10,
//     side: THREE.DoubleSide,
//   });
//   const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
//   const position = calculatePosition(longitude, null, 25);
//   satellite.position.copy(position);
//   satellite.material.color.setHex(0xffffff);
//   satellite.material.shininess = 90;
//   satellite.scale.set(2.5, 2.5, 2.5);
//   earth.add(satellite);

//   const labelCanvas = document.createElement('canvas');
//   labelCanvas.width = 800;
//   labelCanvas.height = 140;
//   const labelCtx = labelCanvas.getContext('2d');
//   labelCtx.font = '100px Arial';
//   labelCtx.fillStyle = '#ffffff';
//   labelCtx.textAlign = 'center';
//   labelCtx.textBaseline = 'top';
//   labelCtx.fillText(name, 228, 32);
//   const labelTexture = new THREE.CanvasTexture(labelCanvas);
//   const labelMaterial = new THREE.MeshBasicMaterial({
//     map: labelTexture,
//     side: THREE.DoubleSide,
//     transparent: true,
//     opacity: 1.0,
//   });
//   const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
//   labelMesh.position.copy(position);
//   labelMesh.position.y += 1.8;
//   labelMesh.rotation.x = -Math.PI / 2;
//   earth.add(labelMesh);

//   const cameraVector = new THREE.Vector3().setFromMatrixPosition(
//     camera.matrixWorld
//   );
//   labelMesh.lookAt(cameraVector);
//   labelMesh.rotateY(Math.PI);

//   return satellite;
// }

// const satellites = satelliteConfig.map(createSatellite);

function calculatePosition(longitude, latitude = 0, radius) {
  const phi = ((90 - latitude) * Math.PI) / 180;
  const theta = ((360 - longitude) * Math.PI) / 180;
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = -radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

//LEO Sats

//Stars
// var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
// var starMaterial = new THREE.MeshPhongMaterial({
//   map: new THREE.TextureLoader().load('../images/8k_stars_milky_way.jpg'),
//   side: THREE.DoubleSide,
//   shininess: 10,
// });
// var starField = new THREE.Mesh(starGeometry, starMaterial);
// scene.add(starField);

// //add new moon code
// var toggleMoonButton = document.getElementById('toggleMoonButton');
// toggleMoonButton.addEventListener('click', function () {
//   moon.visible = !moon.visible;
// });
// var moonRotation = 0.05;
// //Moon
// var moonGeometry = new THREE.SphereGeometry(8.5, 50, 50);
// var moonMaterial = new THREE.MeshPhongMaterial({
//   map: new THREE.TextureLoader().load('../images/moon_texture.jpg'),
// });
// var moon = new THREE.Mesh(moonGeometry, moonMaterial);
// moon.position.set(0, 0, -500); // set moon farther away from earth
// moon.rotation.y = Math.PI; // set moon rotation so that the "dark" side of moon is always away from Earth
// scene.add(moon);

// // Define an animation loop function for the Moon
// function animate() {
//   // Rotate the moon around its own axis
//   moon.rotation.y += 0.006;

//   // Update the moonRotation variable with the new rotation angle
//   moonRotation = moon.rotation.y;

//   // Update the position of the moon so that it always faces the Earth
//   moon.position.x = 500 * Math.cos(moonRotation);
//   moon.position.z = 500 * Math.sin(moonRotation);

//   // Render the scene
//   renderer.render(scene, camera);

//   // Request the next animation frame
//   requestAnimationFrame(animate);
// }

// Start the animation loop
// animate();
/////////// End new moon code
//Camera vector
var earthVec = new THREE.Vector3(0, 0, 0);

var r = 35;
var theta = 0;
var dTheta = (2 * Math.PI) / 1000;

var dx = 0.01;
var dy = -0.01;
var dz = -0.05;

//Render loop
var render = function () {
  earth.rotation.y += 0.0019;
  // clouds.rotation.y += 0.00001;

  // //Moon orbit
  // theta += dTheta;
  // moon.position.x = r * Math.cos(theta);
  // moon.position.z = r * Math.sin(theta);

  // Initialize boolean variable to track code snippet state
  // let flyoverEnabled = true;

  // Add event listener to toggle button
  // document
  //   .getElementById('toggleFlyoverButton')
  //   .addEventListener('click', function () {
  //     flyoverEnabled = !flyoverEnabled; // Toggle state
  //   });

  // Define render function
  function render() {
    // Check if code snippet is enabled
    // if (flyoverEnabled) {
    //   camera.position.x += dx;
    //   camera.position.y += dy;
    //   camera.position.z += dz;
    // }

    camera.lookAt(earthVec);

    //Flyby reset
    if (camera.position.z < -200) {
      camera.position.set(0, 35, 70);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  //USS ENTERPRISE

  // Define the orbit parameters
  var orbitRadius = 10.7;
  var orbitSpeed = -0.701; // negative radians per frame

  // Define the initial longitude and latitude
  var longitude = 230; // starting position on the opposite side of the Earth
  var latitude = 0;

  // Define the USS Enterprise object
  // var starshipTexture = new THREE.TextureLoader().load(
  //   '../images/ussenterprise.png'
  // );
  // var starshipMaterial = new THREE.SpriteMaterial({
  //   map: starshipTexture,
  //   color: 0xffffff,
  // });
  // var ENTERPRISE = new THREE.Sprite(starshipMaterial);
  // ENTERPRISE.scale.set(1, 0.5, 1);

  // // Add the USS Enterprise object to the scene
  // earth.add(ENTERPRISE);

  // Define the animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate the earth around the y-axis
    if (TOGGLE_ROTATION) earth.rotation.y += 0.0051;

    // Update the longitude and latitude
    longitude += orbitSpeed;
    if (longitude < 0) longitude += 360; // handle negative values

    // Calculate the new position of the USS Enterprise object
    var position = calculatePosition(longitude, latitude, orbitRadius);

    // Set the position of the USS Enterprise object
    // ENTERPRISE.position.copy(position);

    // Make the USS Enterprise object look at the camera
    // var cameraVector = new THREE.Vector3();
    // cameraVector.setFromMatrixPosition(camera.matrixWorld);
    // ENTERPRISE.lookAt(cameraVector);
  }
  // Start the animation loop
  animate();
  // Function to calculate the position of an object on a sphere given its longitude, latitude, and radius
  function calculatePosition(longitude, latitude, radius) {
    var position = new THREE.Vector3();
    var phi = THREE.Math.degToRad(90 - latitude);
    var theta = THREE.Math.degToRad(longitude);
    position.x = radius * Math.sin(phi) * Math.cos(theta);
    position.y = radius * Math.cos(phi);
    position.z = radius * Math.sin(phi) * Math.sin(theta);
    return position;
  }
  //END OF USS ENTERPRISE SECTION
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
