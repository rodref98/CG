/*global THREE, requestAnimationFrame, console*/



var camera1 = new Array(3);
var active_camera = 0;

var moveForward = false;
var moveBackwards = false;
var breakFB = false;

var scene, renderer;

var geometry, material, mesh;

var table, left_cannon, middle_cannon, right_cannon;
var selected_cannon;

class Base_Object extends THREE.Object3D{
  constructor(){
    super();
  }

  toggleWireframe(wire) {
    this.children[0].material.wireframe = wire;
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

class Cannon extends Base_Object {
  constructor(x, y, z){
    super();
    createCannon(this, obj, x, y, z, rotY);
  }

  toggleSelectedCannon(){
    this.children[0].material.color.set(0xff0000);
  }
  myType(){
    return "Cannon";
  }
}

function addTableLeg(obj, x, y, z) {
    'use strict';
    geometry = new THREE.SphereGeometry(4, 6, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
}

function addGroundWall(obj, x, y, z) {
  'use strict';
  geometry = new THREE.CubeGeometry(60, 2, 62);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function addSideWall(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(60, 10, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addBackWall(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(2, 10, 60);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCannonCylinder(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(4.5, 7, 20, 32, 0, true);
    mesh = new THREE.Mesh(geometry, material);

    obj.add(mesh);
    mesh.position.set(x, y, z);

    //obj.children.material.color.set(0xff0000);
    obj.add(mesh);
}

function addCannonArtic(obj, x, y, z){

    material = new THREE.MeshBasicMaterial( { color: 0x1E90FF, wireframe: true } );
    geometry = new THREE.SphereBufferGeometry(7, 8, 6, 0, 2*Math.PI, Math.PI/2, 0.5 * Math.PI);
    material.side = THREE.DoubleSide;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);


    //scene.add(artic);
}


function createWall(x, y, z) {
    'use strict';

    table = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xffe4b5, wireframe: true });
    addGroundWall(table, 0, -1, -30);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    addSideWall(table, 0, 5, 0);
    addSideWall(table, 0, 5, -60);
    addBackWall(table, -29, 5, -30);
    //addTableLeg(table, 25, 0, 8);
    //addTableLeg(table, 25, 0, 16);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
    scene.add(table);
}



function createCannon(index, x, y, z, rotY) {
    'use strict';

    index = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x1E90FF, wireframe: true });


    //index.material.color.set(0xff0000);
    addCannonCylinder(index, 0, 10, 0);
    addCannonArtic(index, 0, 0, 0);

    scene.add(index);

    index.rotation.z = Math.PI/2;
    index.rotation.y = rotY;
    index.position.x = x;
    index.position.y = y;
    index.position.z = z;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));


    createWall(-25, 0, 0);
    left_cannon = createCannon(left_cannon, 55, 5, -5, -Math.PI/16);
    middle_cannon = createCannon(middle_cannon,55, 5, -30, 0);
    right_cannon = createCannon(right_cannon,55, 5, -55, Math.PI/16);
    left_cannon.toggleSelectedCannon();



}

//Camara frontal
function createCamera3() {
    'use strict';

    camera1[2] = new THREE.OrthographicCamera( -70, 70, 40, -40, 1, 1000 );


    camera1[2].position.x = -2.5;
    camera1[2].position.y = 0;
    camera1[2].position.z = 0;
    camera1[2].lookAt(scene.position);
}
//Camara lateral
function createCamera2() {
    'use strict';

    camera1[1] = new THREE.OrthographicCamera( -70, 70, 40, -40, 1, 1000 );


    camera1[1].position.x =0;
    camera1[1].position.y = 0;
    camera1[1].position.z = 100;
    camera1[1].lookAt(scene.position);
}

//Camara com vista de topo
function createCamera() {
    'use strict';

    camera1[0] = new THREE.OrthographicCamera( -100, 100, 70, -70, 1, 1000 );


    camera1[0].position.x =0;
    camera1[0].position.y = 140;
    camera1[0].position.z = 0;
    camera1[0].lookAt(scene.position);
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
    case 52: //4
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;
    case 49: //1
        switch_camera(0);
        break;

    case 50: //2
        switch_camera(1);
        break;

    case 51: //3
        switch_camera(2);
        break;

    case 37://left arrow
    case 38://forward arrow
        moveForward = true;
        break;
    case 39://right arrow
    case 40://backwards arrow
        moveBackwards = true;
        break;
    case 65: //a
    case 68: //d
    case 69:  //E
    case 81: //Q
          left_cannon.material.color.set(0xff0000);
          selected_cannon = left_cannon;
          break;
    case 83: //s
    case 87: //w
          left_cannon.material.color.set(0xff0000);
    case 101: //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
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
	render();

	requestAnimationFrame(animate);
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
    createCamera3();
    switch_camera(0);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}
