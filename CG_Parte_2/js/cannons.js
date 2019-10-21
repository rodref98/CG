/*global THREE, requestAnimationFrame, console*/



var camera1 = new Array(3);
var active_camera = 0;

var moveForward = false;
var moveBackwards = false;
var breakFB = false;

var scene, renderer;

var geometry, material, mesh;
var meshes = [];
var merged_geo = new THREE.Geometry();

var table, left_cannon, middle_cannon, right_cannon;
var ball,ball1,ball2;
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
  constructor(x, y, z, rotY){
    super();
    createCannon(this, x, y, z, rotY);
    this.rotY = rotY;
  }

  toggleSelectedCannon(){
    if (this.rotY == 0){
      meshes[2].material.color.set(0xff0000);
      meshes[3].material.color.set(0xff0000);
      meshes[0].material.color.set(0x1E90FF);
      meshes[1].material.color.set(0x1E90FF);
      meshes[4].material.color.set(0x1E90FF);
      meshes[5].material.color.set(0x1E90FF);
    }
    else if (this.rotY == -Math.PI/16) {
      meshes[0].material.color.set(0xff0000);
      meshes[1].material.color.set(0xff0000);
      meshes[2].material.color.set(0x1E90FF);
      meshes[3].material.color.set(0x1E90FF);
      meshes[4].material.color.set(0x1E90FF);
      meshes[5].material.color.set(0x1E90FF);
    }
    else if (this.rotY == Math.PI/16) {
      meshes[4].material.color.set(0xff0000);
      meshes[5].material.color.set(0xff0000);
      meshes[0].material.color.set(0x1E90FF);
      meshes[1].material.color.set(0x1E90FF);
      meshes[2].material.color.set(0x1E90FF);
      meshes[3].material.color.set(0x1E90FF);
    }
  }
  myType(){
    return "Cannon";
  }
}

class Ball extends Base_Object {
  constructor(x, y, z){
    super();
    createBall(this, x, y, z);
  }

  myType(){
    return "Ball";
  }
}

function addBall(obj, x, y, z) {
    'use strict';
    geometry = new THREE.SphereGeometry(4, 16 ,12);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y , z);
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

    geometry = new THREE.CylinderGeometry(4.5, 4.5, 20, 32, 0, true);
    mesh = new THREE.Mesh(geometry, material);

    obj.add(mesh);
    mesh.position.set(x, y, z);
    meshes.push(mesh);
    //meshes[0].updateMatrix();
    //merged_geo.merge(meshes[0].geometry, meshes[0].matrix);
    //obj.children.material.color.set(0xff0000);
    obj.add(mesh);
}

function addCannonArtic(obj, x, y, z){

    material = new THREE.MeshBasicMaterial( { color: 0x1E90FF, wireframe: true } );
    geometry = new THREE.SphereBufferGeometry(4.5, 8, 6, 0, 2*Math.PI, Math.PI/2, 0.5 * Math.PI);
    material.side = THREE.DoubleSide;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    meshes.push(mesh);
    //mesh.updateMatrix();
    //merged_geo.merge(geometry, mesh.matrix);
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
    if (rotY == 0){
      meshes[2].material.color.set(0xff0000);
      meshes[3].material.color.set(0xff0000);
    }
    scene.add(index);

    index.rotation.z = Math.PI/2;
    index.rotation.y = rotY;
    index.position.x = x;
    index.position.y = y;
    index.position.z = z;
}

function createBall(x, y, z) {
  'use strict';

  ball = new THREE.Object3D();

  material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  addBall(ball,-20,5,-25);
  

  ball.position.x = x;
  ball.position.y = y;
  ball.position.z = z;
  scene.add(ball);
}


function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));


    createWall(-25, 0, 0);
    left_cannon = createCannon(left_cannon, 55, 5, -5, -Math.PI/16);
    middle_cannon = createCannon(middle_cannon,55, 5, -30, 0);
    right_cannon = createCannon(right_cannon,55, 5, -55, Math.PI/16);
    ball1 = createBall(-20,0,-20);
    ball2 = createBall(0,0,0);


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
          right_cannon.toggleSelectedCannon();
          break;
    case 81: //Q
          left_cannon.toggleSelectedCannon();
          break;
    case 83: //s
    case 87: //w
          middle_cannon.toggleSelectedCannon();
          break;
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
