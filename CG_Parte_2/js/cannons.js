/*global THREE, requestAnimationFrame, console*/



var camera1 = new Array(3);
var active_camera = 0;

var moveForward = false;
var moveBackwards = false;
var breakFB = false;

var scene, renderer;

var wires = true;
var grupo = new THREE.Group();
var geometry, material, mesh;
var meshes = [];

var table, left_cannon, middle_cannon, right_cannon;
var ball,ball1,ball2, ball3;
var selected_cannon;
var matrix_rotate;

var ratio = 2.07;
var scale = 0.013
var scale_width;
var scale_height;
var last_width;
var last_height;

var clock = new THREE.Clock();
var new_bulet_allowed = true;

var ratio = 2.07;
var scale = 0.013
var scale_width;
var scale_height;
var last_width;
var last_height;

var new_bulet_allowed = true;

class Base_Object extends THREE.Object3D{
  constructor(){
    super();
		this.velocity = new THREE.Vector3();
		this.aceleration = new THREE.Vector3();
		this.maxvel = new THREE.Vector3();
		this.minvel = new THREE.Vector3();
		this.width = 0;
		this.height = 0;
		this.radius = 0;
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
    if (rotY == 0){
      this.ball_position = [75, 0, -5];
    }
    else if (rotY == Math.PI/16){
      this.ball_position = [75, 0, -30];
    }
    else if (rotY == -Math.PI/16) {
      this.ball_position = [75, 0, 20];
    }
  }

  toggleSelectedCannon(){
    if (this.rotY == 0){
      meshes[2].material.color.set(0xff0000);
      meshes[3].material.color.set(0xff0000);
      meshes[0].material.color.set(0x1E90FF);
      meshes[1].material.color.set(0x1E90FF);
      meshes[4].material.color.set(0x1E90FF);
      meshes[5].material.color.set(0x1E90FF);
      selected_cannon = middle_cannon;
    }
    else if (this.rotY == -Math.PI/16) {
      meshes[0].material.color.set(0xff0000);
      meshes[1].material.color.set(0xff0000);
      meshes[2].material.color.set(0x1E90FF);
      meshes[3].material.color.set(0x1E90FF);
      meshes[4].material.color.set(0x1E90FF);
      meshes[5].material.color.set(0x1E90FF);
      selected_cannon = left_cannon;
    }
    else if (this.rotY == Math.PI/16) {
      meshes[4].material.color.set(0xff0000);
      meshes[5].material.color.set(0xff0000);
      meshes[0].material.color.set(0x1E90FF);
      meshes[1].material.color.set(0x1E90FF);
      meshes[2].material.color.set(0x1E90FF);
      meshes[3].material.color.set(0x1E90FF);
      selected_cannon = right_cannon;
    }
  }

  toggleLeftMovement(){
    selected_cannon.rotateX(0.05);
  }
  toggleRightMovement(){
    selected_cannon.rotateX(-0.05);
  }
  shootBall(){
    this.ball = new Ball(this.ball_position[0], this.ball_position[1], this.ball_position[2]);
    this.ball.position.set(this.ball_position[0], this.ball_position[1], this.ball_position[2]);
  }

  myType(){
    return "Cannon";
  }
}

class Ball extends Base_Object {
  constructor(x, y, z){
    super();
    this.velocity = new THREE.Vector3();
    this.velocity.set(1, 0,	 0);
    createBall(x, y, z);
  }

  update_position(ticks){
    //var oldvelocity = new THREE.Vector3().copy(this.velocity);
		var oldposition = new THREE.Vector3().copy(this.position);

    //var newvelocity = (oldvelocity.addScaledVector(this.aceleration, delta));

    var newposition = oldposition.add(this.velocity);

    this.position.copy(newposition);

  }
  myType(){
    return "Ball";
  }
}

function createBall(x, y, z) {
  'use strict';

  ball = new THREE.Object3D();

  material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: wires });
  geometry = new THREE.SphereGeometry(4, 16 ,12);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(-20,5,-25);
  ball.add(mesh);
  //addBall(ball,-20,5,-25);


  ball.position.x = x;
  ball.position.y = y;
  ball.position.z = z;
  grupo.add(ball);
}



/*function addBall(obj, x, y, z) {
    'use strict';
    geometry = new THREE.SphereGeometry(4, 16 ,12);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y , z);
    obj.add(mesh);
}*/


function createWall(x, y, z) {
    'use strict';

    table = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xffe4b5, wireframe: wires });
    addGroundWall(table, 0, -1, -30);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: wires });
    addSideWall(table, 0, 5, 0);
    addSideWall(table, 0, 5, -60);
    addBackWall(table, -29, 5, -30);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
    grupo.add(table);
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


function createCannon(index, x, y, z, rotY) {
  'use strict';

  material = new THREE.MeshBasicMaterial({ color: 0x1E90FF, wireframe: wires });

  addCannonCylinder(index, 0, 10, 0);
  addCannonArtic(index, 0, 0, 0);
  if (rotY == 0){
    meshes[2].material.color.set(0xff0000);
    meshes[3].material.color.set(0xff0000);
  }
  grupo.add(index);

  index.rotation.z = Math.PI/2;
  index.rotation.y = rotY;
  index.position.x = x;
  index.position.y = y;
  index.position.z = z;
}

function addCannonCylinder(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(4.5, 4.5, 20, 32, 0, true);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    meshes.push(mesh);

    obj.add(mesh);
}

function addCannonArtic(obj, x, y, z){

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





function create_matrixR(x) {
  matrix_rotate = new Float32Array(16);

  matrix_rotate[0] = Math.cos(x);
  matrix_rotate[1] = -Math.sin(x);
  matrix_rotate[2] = 0;
  matrix_rotate[4] = Math.sin(x);
  matrix_rotate[5] = Math.cos(x);
  matrix_rotate[6] = 0;
  matrix_rotate[8] = 0;
  matrix_rotate[9] = 0;
  matrix_rotate[10] = 1;


}
function rotate() {
  var result = new Float32Array(16);
  var resultb = new Float32Array(16);
  var resultMatrix = new THREE.Matrix4();
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var sum = 0;
      var sumb = 0;
      for (var k = 0; k < 3; k++) {
        if (undefined != meshes[0].matrix.elements){
        sum += meshes[0].matrix.elements[4*i+k] * matrix_rotate[4*k+j];
        sumb += meshes[1].matrix.elements[4*i+k] * matrix_rotate[4*k+j];
        }
      }
      result[4*i+j] = sum;
      resultb[4*i+j] = sumb;
    }
  }
  resultMatrix.fromArray(result);
  console.log(resultMatrix);
  meshes[0].matrix = resultMatrix;

  meshes[1].matrix.elements = resultb;
  console.log(meshes[0].matrix.elements);

}
 function checkMove(){
   var ticks = clock.getDelta();
   selected_cannon.ball.update_position(ticks);
 }

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));


    createWall(-25, 0, 0);
    left_cannon = new Cannon(55, 5, -5, -Math.PI/16);
    middle_cannon = new Cannon(55, 5, -30, 0);
    right_cannon = new Cannon(55, 5, -55, Math.PI/16);
    selected_cannon = middle_cannon;
    //ball = new Ball(75,0,-30);
    //ball1 = new Ball(75,0,-5);
    //ball2 = new Ball(75,0,20);
    create_matrixR(Math.PI/2);
    rotate();
    ball3 = new Ball(-5, 0, -5);
    scene.add(grupo);

}

//Camara frontal
function createCamera3() {
    'use strict';

    camera1[2] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100);

    camera1[2].position.x = -5;
    camera1[2].position.y = 10;
    camera1[2].position.z = -5;
    middle_cannon.add(camera1[2]);
    camera1[2].lookAt( new THREE.Vector3(0, 0, 0) );
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
      case 32: //Space
        selected_cannon.shootBall();
        break;
      case 52: //4
        wires = !wires;
        for(var i = 0, l = 5; i < l; i++){
          grupo.children[i].children[0].material.wireframe= wires;
        }
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
        selected_cannon.toggleLeftMovement();
        break
    case 38://forward arrow
        moveForward = true;
        break;
    case 39://right arrow
        selected_cannon.toggleRightMovement();
        break
    case 40://backwards arrow
        moveBackwards = true;
        break;
    case 65: //a
      ball3.translateZ(0.01);
      break;
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
    //checkMove();
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
