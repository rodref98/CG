/*global THREE, requestAnimationFrame, console*/


var camera1 = new Array(2);
var active_camera = 0;

var scene, renderer;
var wires = true;
var geometry, material, mesh;
var grupo = new THREE.Group();



class Base_Object extends THREE.Object3D{
  constructor(){
    super();
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
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);  
  
}

function addBackground(obj,x,y,z){
  'use strict';
    geometry = new THREE.CubeGeometry(56, 32, 2.5);
    material = new THREE.MeshBasicMaterial({ color: 0xA9A9A9, wireframe : wires});
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);  
  
}

function addCubes(obj, x, y, z){
  'use strict';
  geometry = new THREE.CubeGeometry(4, 4 , 3);
  material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe : wires});
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);

}
function addCylinders(obj, x, y, z){
  'use strict';
  geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe : wires});
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.x = Math.PI / 2
  obj.add(mesh);

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

class Holofote extends Base_Object {
  constructor(x, y, z){
    super();
    createHolofote(this, x, y, z);
  }

  myType(){
    return "Holofote";
  }

}

class Triangle extends Base_Object {
    constructor(x, y, z){
      super();
      createTriangle(this, x, y, z);
    }

    myType(){
      return "Triangle";
    }
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
  geometry = new THREE.CubeGeometry(80, 0, 80);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addBackWall(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(80, 60, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addSideWall(obj, x, y, z) {
  'use strict';
  geometry = new THREE.CubeGeometry(2, 60, 80);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addPedestalLeg(obj, x, y, z) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0xA9A9A9, wireframe: wires });
    geometry = new THREE.CubeGeometry(3, 20, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addPedestalTop(obj,x,y,z){
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0xA9A9A9, wireframe: wires });
    geometry = new THREE.CubeGeometry(12, 1, 12);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
   
}

function createWall(obj, x, y, z) {
    'use strict';


    material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: wires });
    addGroundWall(obj, 0, 0, 40);
    addBackWall(obj, 0, 30, 1);
    addSideWall(obj, -40, 30, 40);
    addPedestalLeg(obj, 70, 10, 45);
    addPedestalTop(obj, 70, 20, 45);
    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;
    grupo.add(obj);
}

function addHolofoteArtic(obj, x, y, z){

    geometry = new THREE.SphereBufferGeometry(3.9, 8, 6, 0, 2*Math.PI, -Math.PI/2, 0.5 * Math.PI);
    material.side = THREE.DoubleSide;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);

}

function addHolofoteCone(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(4, 0, 10, 22, 0, true);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);

    obj.add(mesh);
}

function createHolofote(index, x, y, z) {
    'use strict';


    material = new THREE.MeshBasicMaterial({ color: 0x1E90FF, wireframe: wires });
    addHolofoteCone(index, 0, 10, 0);
    addHolofoteArtic(index, 0, 14, 0);

    index.rotation.z = Math.PI/2;
    index.rotation.y = -Math.PI/2;
    index.position.x = x;
    index.position.y = y;
    index.position.z = z;
    grupo.add(index);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));

    new Painting(0,30,3);

    new Triangle(20,0,20);
    new Wall(0,0,0);
    new Holofote(-25, 70, 30);
    new Holofote(-10, 70, 30);
    new Holofote(5, 70, 30);
    new Holofote(20, 70, 30);

    scene.add(grupo);

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

  camera1[1] = new THREE.PerspectiveCamera( 45, 1920/1080, 1, 1000);


  camera1[1].position.x = 50;
  camera1[1].position.y = 40;
  camera1[1].position.z = 200;
  camera1[1].lookAt(scene.position);
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
      case 32: //Space
        selected_cannon.shootBall();
        break;
      case 52: //4
        wires = !wires;
        //console.log(grupo.lenght);
        for(var i = 0; i < grupo.children.length; i++){
          for (var j = 0; j < grupo.children[i].children.length; j++){
            grupo.children[i].children[j].material.wireframe= wires;
          }
        }
        break;
    case 54: //1
        switch_camera(0);
        break;

    case 50: //2
        switch_camera(1);
        break;
    case 37://left arrow
        selected_cannon.toggleLeftMovement();
        break
    case 39://right arrow
        selected_cannon.toggleRightMovement();
        break

    case 69:  //E
          right_cannon.toggleSelectedCannon();
          break;
    case 81: //Q
          left_cannon.toggleSelectedCannon();
          break;
    case 82: //r
        if(Axistf){
          for(var i = 4; i < grupo.children.length; i++){
            console.log(grupo.children[i]);
            grupo.children[i].toggleoffAxisHelper();
          }
          Axistf = false;
        }
        else{
          for(var i = 4; i < grupo.children.length; i++){
            //console.log(grupo.children[i]);
            grupo.children[i].toggleonAxisHelper();
          }
          Axistf = true;
        }
        break;
    case 87: //w
          middle_cannon.toggleSelectedCannon();
          break;
    }
}

function onKeyUp(e) {
    switch (e.keyCode) {
      case 38:
        moveForward = false;
        breakFB = true;
        break;
      case 40:
        moveBackwards = false;
        breakFB = true;
        break;

    }
  }

  function render() {
	renderer.render(scene, camera1[active_camera]);
}

function animate() {
  //Renders Scene
  requestAnimationFrame(animate);

  render();
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
    createCamera2();
    switch_camera(0);


    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}
