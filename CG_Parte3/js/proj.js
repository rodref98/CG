/*global THREE, requestAnimationFrame, console*/


var camera1 = new Array(2);
var active_camera = 0;

var sculpturemovement = true;
var scene, renderer;
var wires = true;
var geometry, material, mesh;
var sculpture;
var sculpturemat;
var grupo = new THREE.Group();
var directional_light,spotlight1,spotlight2,spotlight3,spotlight4;
var material_array;
var mSpotlight_array = new Array(3);
var mPedestal_array = new Array(3);
var mFrame_array = new Array(3);
var mBackground_array = new Array(3);
var mCubes_array = new Array(3);
var mCyllinders_array = new Array(3);
var material_counter = 0;

class Base_Object extends THREE.Object3D{
  constructor(){
    super();
	}

  calcLight(){
    if(this.myType() != "Painting" && this.myType() != "Spotlight" && this.myType() != "Pedestal" && this.myType() != "Sculpture"){
      for (var j = 0; j < this.children.length; j++){
        this.children[j].material = material_array[0];
      }
    }
    else if(this.myType() == "Spotlight"){
      for (var j = 0; j < this.children.length; j++){
        this.children[j].material = mSpotlight_array[0];
      }
    }
    else if(this.myType() == "Pedestal"){
      this.children[0].material = mPedestal_array[0];
      this.children[1].material = mPedestal_array[0];
    }
    else if(this.myType() == "Painting"){
      console.log(this.children.length);
      for (var j = 0; j < this.children.length; j++){
        if(j == 0) {
            this.children[j].material = mFrame_array[0];
          }
        else if(j == 1){
            this.children[j].material = mBackground_array[0];
          }
        else if(j > 1 && j < 47){
            this.children[j].material = mCubes_array[0];
          }
        else {
            this.children[j].material = mCyllinders_array[0];
          }
      }

    }
    else if(this.myType() == "Sculpture"){
      this.children[0].material = sculpturemat[0];
    }
    material_counter = 0;
  }
  changeMaterial(){
    if(this.myType() != "Painting" && this.myType() != "Spotlight" && this.myType() != "Pedestal" && this.myType() != "Sculpture"){
      for (var j = 0; j < this.children.length; j++){
        this.children[j].material = material_array[material_counter];
      }
    }
    else if(this.myType() == "Spotlight"){
      for (var j = 0; j < this.children.length; j++){
        this.children[j].material = mSpotlight_array[material_counter];
      }
    }
    else if(this.myType() == "Pedestal"){
      this.children[0].material = mPedestal_array[material_counter];
      this.children[1].material = mPedestal_array[material_counter];
    }
    else if(this.myType() == "Painting"){
      console.log(this.children.length);
      for (var j = 0; j < this.children.length; j++){
        if(j == 0) {
            this.children[j].material = mFrame_array[material_counter];
          }
        else if(j == 1){
            this.children[j].material = mBackground_array[material_counter];
          }
        else if(j > 1 && j < 47){
            this.children[j].material = mCubes_array[material_counter];
          }
        else {
            this.children[j].material = mCyllinders_array[material_counter];
          }
      }
    }
      else if(this.myType() == "Sculpture"){
        this.children[0].material = sculpturemat[material_counter];
      }
  }

  changeLightMaterial(){

  }

  myType(){
    return "Object";
  }

}

class Painting extends Base_Object{
  constructor(x,y,z){
    super();
    createPainting(this, x, y, z);
  }
  myType(){
    return "Painting";
  }
}

class Wall extends Base_Object {
  constructor(x, y, z){
    super();
    createWall(this, x, y, z);
  }

  myType(){
    return "Wall";
  }
}

class Pedestal extends Base_Object {
  constructor(x, y, z){
    super();
    createPedestal(this, x, y, z);
  }

  myType(){
    return "Pedestal";
  }
}

class Spotlight extends Base_Object {
  constructor(x, y, z, tx, ty, tz){
    super();
    this.spotlight = new THREE.SpotLight(0xffffff);
    createSpotlight(this, x, y, z, tx, ty, tz);
  }

  myType(){
    return "Spotlight";
  }

}

class Sculpture extends Base_Object {
  constructor(x, y, z){
    super();
    createSculpture(this, x, y, z);
  }

  myType(){
    return "Sculpture";
  }

}

function createPainting(obj,x,y,z){
  'use strict';
  var auxx = -24;
  var auxy = 42;
  var auxz = 3;
  addFrame(obj, x, y, z);
  addBackground(obj, x, y ,z);
  for(var j = 0; j < 9; j ++){
    auxy = 42;
    if(j != 0) auxx += 6;
    for(var i = 0; i < 5; i++){
      addCubes(obj, auxx, auxy, auxz);
      auxy = auxy - 6;
    }
  }
  auxx = -27;
  auxy = 45;
  auxz = 5;
  for(var j = 0; j < 10; j ++){
    auxy = 45;
    if(j != 0) auxx += 6;
    for(var i = 0; i < 6; i++){
      addCylinders(obj, auxx, auxy, auxz);
      auxy = auxy - 6;
    }
  }
  grupo.add(obj);
}

function addFrame(obj,x,y,z){
  'use strict';

    geometry = new THREE.CubeGeometry(64, 40, 2);
    material = new THREE.MeshBasicMaterial({ color: 0xB8860B, wireframe : wires});
    mFrame_array[0] = new THREE.MeshBasicMaterial({ color: 0xB8860B, wireframe: !wires });
    mFrame_array[1] = new THREE.MeshLambertMaterial({color: 0xB8860B})
    mFrame_array[2] = new THREE.MeshPhongMaterial({ color: 0xB8860B, shininess: 50 });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    obj.add(mesh);

}

function addBackground(obj,x,y,z){
  'use strict';
    geometry = new THREE.CubeGeometry(56, 32, 2.5);
    material = new THREE.MeshBasicMaterial({ color: 0xA9A9A9, wireframe : wires});
    mBackground_array[0] = new THREE.MeshBasicMaterial({ color: 0xA9A9A9, wireframe: !wires });
    mBackground_array[1] = new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    mBackground_array[2] = new THREE.MeshPhongMaterial({ color: 0xA9A9A9, shininess: 50 });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);

}

function addCubes(obj, x, y, z){
  'use strict';
  geometry = new THREE.CubeGeometry(4, 4 , 3);
  material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe : wires});
  mCubes_array[0] = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: !wires });
  mCubes_array[1] = new THREE.MeshLambertMaterial({color: 0x000000})
  mCubes_array[2] = new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 50 });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);

}
function addCylinders(obj, x, y, z){
  'use strict';
  geometry = new THREE.CylinderGeometry(1.2, 1.2, 2, 32);
  material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe : wires});
  mCyllinders_array[0] = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: !wires });
  mCyllinders_array[1] = new THREE.MeshLambertMaterial({color: 0xFFFFFF})
  mCyllinders_array[2] = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 50 });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.x = Math.PI / 2
  obj.add(mesh);

}




function createTriangle(obj,x,y,z){
    geometry = new THREE.Geometry();
    material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: wires });
    var v1 = new THREE.Vector3(0, 0, 0);
    var v2 = new THREE.Vector3(0, 0, -30);
    var v3 = new THREE.Vector3(0, 30, -30);
    var triangle = new THREE.Triangle(v1, v2, v3);
    var normal = triangle.normal();
    geometry.vertices.push(triangle.a);
    geometry.vertices.push(triangle.b);
    geometry.vertices.push(triangle.c);
    geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x,y,z);
    scene.add(mesh);

}


function addGroundWall(obj, x, y, z) {
  'use strict';
  geometry = new THREE.CubeGeometry(80, 2, 80);
  mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  obj.add(mesh);
}

function addBackWall(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(80, 60, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addSideWall(obj, x, y, z) {
  'use strict';
  geometry = new THREE.CubeGeometry(2, 60, 80);
  mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createWall(obj, x, y, z) {
  'use strict';


  material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: wires });
  addGroundWall(obj, 0, 0, 40);
  addBackWall(obj, 0, 30, 1);
  addSideWall(obj, -40, 30, 40);

  obj.position.x = x;
  obj.position.y = y;
  obj.position.z = z;
  grupo.add(obj);
}

function addPedestalLeg(obj, x, y, z) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0x1E90FF, wireframe: wires });
    mPedestal_array[0] = new THREE.MeshBasicMaterial({ color: 0x1E90FF, wireframe: !wires });
    mPedestal_array[1] = new THREE.MeshLambertMaterial({color: 0x1E90FF })
    mPedestal_array[2] = new THREE.MeshPhongMaterial({ color: 0x1E90FF, shininess: 50 });
    geometry = new THREE.CubeGeometry(3, 20, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    obj.add(mesh);
}

function addPedestalTop(obj,x,y,z){
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0x1E90FF, wireframe: wires });
    geometry = new THREE.CubeGeometry(12, 1, 12);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    obj.add(mesh);

}

function createPedestal(obj, x, y, z) {
    'use strict';

    addPedestalLeg(obj, 30, 10, 55);
    addPedestalTop(obj, 30, 20, 55);


    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;
    grupo.add(obj);
}


function addSpotlightArtic(obj, x, y, z){

    geometry = new THREE.SphereBufferGeometry(3.9, 8, 6, 0, 2*Math.PI, -Math.PI/2, 0.5 * Math.PI);
    material.side = THREE.DoubleSide;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);

}

function addSpotlightCone(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(4, 0, 10, 22, 0, true);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);

    obj.add(mesh);
}

function createSpotlight(index, x, y, z, tx, ty, tz) {
    'use strict';


    material = new THREE.MeshBasicMaterial({ color: 0x1E90FF, wireframe: wires });
    mSpotlight_array[0] = new THREE.MeshBasicMaterial({ color: 0x1E90FF, wireframe: !wires });
    mSpotlight_array[1] = new THREE.MeshLambertMaterial({color: 0x1E90FF})
    mSpotlight_array[2] = new THREE.MeshPhongMaterial({ color: 0x1E90FF, shininess: 50 });
    //material = new THREE.MeshLambertMaterial( { color:0xff0000} );
    addSpotlightCone(index, 0, 10, 0);
    addSpotlightArtic(index, 0, 14, 0);

    index.spotlight.position.set (x,y,z-10);
    index.spotlight.target.position.set(tx,ty,tz);
    index.spotlight.angle = 0.8;
    index.spotlight.intensity = 0.6;
    index.spotlight.penumbra = 0.2;
    index.spotlight.decay = 2;

    index.spotlight.castShadow = true;
    index.spotlight.shadow.camera.near = 0.5;
    index.spotlight.shadow.camera.far = 500;
    index.spotlight.shadow.camera.fov = 30;

    index.spotlight.shadow.mapSize.width = 512;
    index.spotlight.shadow.mapSize.height = 512;
    scene.add(index.spotlight.target);
    scene.add(index.spotlight);


    index.rotation.z = Math.PI/2;
    index.rotation.y = -Math.PI/2;
    index.position.x = x;
    index.position.y = y;
    index.position.z = z;
    grupo.add(index);
}
function onOroffLight(){
  'use strict';

  var state = !directional_light.visible;
  directional_light.visible = state;
}

function initMaterials(){
  'use strict';

    material_array = new Array(3);
    material_array[0] = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: !wires });
    material_array[1] = new THREE.MeshLambertMaterial({ color: 0xFFFFFF});
    material_array[2] = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 50 });

    sculpturemat = new Array(3);
	  sculpturemat[0] = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: !wires });
	  sculpturemat[1] = new THREE.MeshLambertMaterial( {color: 0x00ff00});
	  sculpturemat[2] = new THREE.MeshPhongMaterial( {color: 0x00ff00, shininess: 100});
}




function customSculpture() {
	var geo = new THREE.Geometry();

	var vertex = [];


	createVertexGroup(vertex, 0, 4, 0, 4, 0, 2);
	createVertexGroup(vertex, 0, 6, 0, 4, 1, -1);
  createVertexGroup(vertex, 0, 4, 0, 4, 0, 3);
  createVertexGroup(vertex, -1, 0, 4, 8, 0, 2);
  createVertexGroup(vertex, 5, 2, 8, 1, 1, 2);
  createVertexGroup(vertex, 3.5, 5, 8, 1, -2, 2);
  createVertexGroup(vertex, -5, 2, 8, 1, 1, 2);
  createVertexGroup(vertex, -3.5, 5, 8, 1, -2, 2);
  createVertexGroup(vertex, 0, 5, 12, 1, -2, 0);
	var faces = [];

	// Parte de baixo
	createFace(faces, 0, 1, 2); 	//Bottom 1
	createFace(faces, 0, 1, 7); 	//Top  2
	createFace(faces, 0, 2, 8); 	//Left  3
  createFace(faces, 0, 7, 16);	//Front 5
  createFace(faces, 0, 8, 16);	//Right 4




  //Parte central

  createFace(faces, 1, 2, 20);	//Back-Left
	createFace(faces, 1, 7, 24);	//Back-Right*/
  createFace(faces, 2, 8, 36);	//Top
  createFace(faces, 7, 16, 30);		//Bottom
	createFace(faces, 8, 16, 42); 	//Left

  createFace(faces, 1, 24, 20);	//Right
	createFace(faces, 2, 20, 36);	//Back-Left
	createFace(faces, 8, 36, 42);	//Back-Right
  createFace(faces, 16, 30, 42); //Bottom
  createFace(faces, 7, 24, 30); //Bottom


  // Parte de cima
	createFace(faces, 30, 48, 42); //Top
	createFace(faces, 36, 48, 42); //Left
	createFace(faces, 20, 48, 36); //Right
	createFace(faces, 20, 48, 24); //Back-Left
	createFace(faces, 24, 48, 30); //Back-Right


	geo.vertices = vertex;
	geo.faces = faces;
	geo.computeFaceNormals();
  geo.computeVertexNormals();
	return geo;
}

function createSculpture(sculpture, x, y, z) {

  //sculpture = new THREE.Object3D();
	//var meshes = [];

	//var sculptureMaterial = sculpturemat[0];

	var geo = customSculpture();
	//var geo = mergeMeshes(meshes);
	//geo.computeFaceNormals();
  var sculpturematerial = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: wires });
  var mesh = new THREE.Mesh(geo, sculpturematerial);
  mesh.castShadow = true;
	sculpture.add(mesh);

	sculpture.position.x = x;
	sculpture.position.y = y;
	sculpture.position.z = z;

	grupo.add(sculpture);
}


function createFace(faces, v0, v1, v2) {
		faces.push(new THREE.Face3(v0, v1, v2));
}



function createVertexGroup(vertex, x0, x1, y0, y1, z0, z1) {
	vertex.push(
		new THREE.Vector3(x0 , y0, z0),  // v0
		new THREE.Vector3(x1, y1, z1),   // v1
		new THREE.Vector3(-x1, y1, z1),  //v2

		new THREE.Vector3(x0, y0, z1), 	// v3
		new THREE.Vector3(x0, y1, -z1),	// v4
		new THREE.Vector3(-x1, y0, z1)  // v5
	);
}















function toggleWireframe() {
	wires = !wires;

	for (var mat of sculpturemat) {
		mat.wireframe = wires;
	}
}



function createScene() {
    'use strict';

    scene = new THREE.Scene();

    initMaterials();

    var painting = new Painting(0,30,3);
    new Pedestal(-40, 0, 0);
    //new Triangle(20,0,20);
    new Wall(0,0,0);
    spotlight1 = new Spotlight(20, 20, 100, 0, 30, 0);
    spotlight1.rotateX(Math.PI/12);
    spotlight2 = new Spotlight(100, 40, 30, 70, 20, 20);
    spotlight2.rotateX(Math.PI/3);
    spotlight3 = new Spotlight(-30, 25, 90, 10 , 10, 10);
    spotlight3.rotateX(-Math.PI/6);
    spotlight4 = new Spotlight(40, 25, 90, 10 ,10 ,0);
    spotlight4.rotateX(Math.PI/12);

    sculpture = new Sculpture(-10,22,55);
    directional_light = new THREE.DirectionalLight(0xffffff, 1);
    directional_light.position.set(40, 80, 60);
    directional_light.target.position.set(0, 30, 0);
    directional_light.target.updateMatrixWorld();
    directional_light.castShadow = true;

    scene.add(grupo);
    scene.add(directional_light, directional_light.target);
    //directional_light.target = grupo.children[1];
    //console.log(grupo.children[1]);

}


function createCamera() {
    'use strict';

    camera1[0] = new THREE.OrthographicCamera( -100, 100, 70, -70, 1, 1000 );


    camera1[0].position.x =0;
    camera1[0].position.y = 0;
    camera1[0].position.z = 7;
    camera1[0].lookAt(scene.position);
}



//Camara lateral
function createCamera2() {
  'use strict';

  camera1[1] = new THREE.PerspectiveCamera( 65, 1920/1080, 1, 1000);


  camera1[1].position.x = 40;
  camera1[1].position.y = 30;
  camera1[1].position.z = 150;
  camera1[1].lookAt(scene.position);
}
function createCamera3() {
  'use strict';

  camera1[2] = new THREE.OrthographicCamera( -100, 100, 70, -70, 1, 1000 );


  camera1[2].position.x =100;
  camera1[2].position.y = 130;
  camera1[2].position.z = 0;
  camera1[2].lookAt(scene.position);
}
function switch_camera(number) {
	active_camera = number;
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera1.aspect = window.innerWidth / window.innerHeight;
        camera1[active_camera].updateProjectionMatrix();
    }

}

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
    case 49: //1
        var state = !spotlight1.spotlight.visible;
        spotlight1.spotlight.visible = state;
        break;

    case 50: //2
        var state = !spotlight2.spotlight.visible;
        spotlight2.spotlight.visible = state;
        break;
    case 51: //3
        var state = !spotlight3.spotlight.visible;
        spotlight3.spotlight.visible = state;
        break;
    case 52: //4
        var state = !spotlight4.spotlight.visible;
        spotlight4.spotlight.visible = state;
        break;

    case 54: //6
        switch_camera(0);
        break;

    case 53: //5
        switch_camera(1);
        break;
    case 55://7
        wires = !wires;
        //console.log(grupo.lenght);
        for(var i = 0; i < grupo.children.length-1; i++){
          for (var j = 0; j < grupo.children[i].children.length; j++){
            //console.log(grupo.children[i].myType());
            grupo.children[i].children[j].material.wireframe= wires;
          }
        }
        break;
    case 37://left arrow
        break
    case 39://right arrow
        switch_camera(2);
        break
    case 69:  //E
          toggleWireframe();
          break;
    case 71: //G
          if(material_counter < 2)
            material_counter++;
          else {
            material_counter = 0;
          }
          console.log(material_counter);
          //Meti -1 por causa do triangulo
          for(var i = 0; i < grupo.children.length; i++){
            grupo.children[i].changeMaterial();
          }
          break
    case 81: //Q
          onOroffLight();
          break;
    case 82: //r
          break;
    case 87: //w
          for(var i = 0; i < grupo.children.length; i++){
            grupo.children[i].calcLight();
          }
          break;
    }
}

function onKeyUp(e) {
    switch (e.keyCode) {

    }
  }

  function render() {
	renderer.render(scene, camera1[active_camera]);
}

function sculptureMove(){
  if(sculpturemovement){
    sculpture.rotateY(Math.PI/96);
  }
}
function animate() {
  //Renders Scene
  requestAnimationFrame(animate);
  sculptureMove();
  render();
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
    createCamera2();
    createCamera3();
    switch_camera(0);


    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}
