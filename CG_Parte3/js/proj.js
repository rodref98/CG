/*global THREE, requestAnimationFrame, console*/


var camera1 = new Array(2);
var active_camera = 0;

var scene, renderer;
var wires = true;
var geometry, material, mesh;
var grupo = new THREE.Group();
var table;


class Base_Object extends THREE.Object3D{
  constructor(){
    super();
	}

  myType(){
    return "Object";
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
    var v2 = new THREE.Vector3(30, 0, 0);
    var v3 = new THREE.Vector3(27, 30, 0);
    var triangle = new THREE.Triangle(v1, v2, v3);
    var normal = triangle.normal();
    geometry.vertices.push(triangle.a);
    geometry.vertices.push(triangle.b);
    geometry.vertices.push(triangle.c);
    geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

}


function addGroundWall(obj, x, y, z) {
  'use strict';
  geometry = new THREE.CubeGeometry(60, 0, 62);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addBackWall(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(60, 40, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addPedestal(obj, x, y, z) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0xA9A9A9, wireframe: wires });
    geometry = new THREE.CubeGeometry(3, 20, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createWall(table, x, y, z) {
    'use strict';


    material = new THREE.MeshBasicMaterial({ color: 0x7FFFD4, wireframe: wires });
    addGroundWall(table, 0, 0, 0);
    addBackWall(table, 0, 20, -29);
    addPedestal(table, 0, 11, 0);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
    grupo.add(table);
}




function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));

    new Triangle(5,5,5);
    new Wall(0,0,0);

    scene.add(grupo);

}


function createCamera() {
    'use strict';

    camera1[0] = new THREE.OrthographicCamera( -100, 100, 70, -70, 1, 1000 );


    camera1[0].position.x =0;
    camera1[0].position.y = 140;
    camera1[0].position.z = 0;
    camera1[0].lookAt(scene.position);
}

//Camara lateral
function createCamera2() {
  'use strict';

  camera1[1] = new THREE.PerspectiveCamera( 45, 1920/1080, 1, 1000);


  camera1[1].position.x =0;
  camera1[1].position.y = 40;
  camera1[1].position.z = 100;
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
    case 49: //1
        switch_camera(0);
        break;

    case 50: //2
        switch_camera(1);
        break;

    case 51: //3
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
