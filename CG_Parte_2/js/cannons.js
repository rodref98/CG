/*global THREE, requestAnimationFrame, console*/



var camera1 = new Array(3);
var active_camera = 0;

var scene, renderer;
var wires = true;
var grupo = new THREE.Group();
var contador = 0;
var geometry, material, mesh;
var meshes = [];

var table, left_cannon, middle_cannon, right_cannon;
var ball_camera;
var selected_cannon;
var matrix_rotate;

var width = 150;
var height = 70;
var ratio = 2.07;
var scale = 0.013
var scale_width;
var scale_height;
var last_width;
var last_height;

var clock = new THREE.Clock();
var new_bulet_allowed = true;

<<<<<<< HEAD
=======

var new_bulet_allowed = true;
>>>>>>> b794a7a904e489c16ae1ed40346dd5089e80db67

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

  updatepos(delta) {
		var oldvel = new THREE.Vector3().copy(this.velocity);
		var oldpos = new THREE.Vector3().copy(this.position);

		// v = a * delta; limits velocity within a maximum and minimum value
		var nvel = (oldvel.addScaledVector(this.aceleration, delta)).clamp(this.minvel, this.maxvel);
		// x = x0 + v
		var npos = oldpos.add(nvel);

		/*Checks if object will hit a Wall/Limit before it happens and acts accordingly*/
		if (npos.x - this.width/2 < -width/2) {
			this.collideWallLR(npos, nvel, -1); // left wall (negative)
		}
		else if (npos.x + this.width/2 > width/2) {
			this.collideWallLR(npos, nvel, 1); // right wall (positive)
		}
		else if (npos.y + this.height/2 > height/2) {
			this.collideWallTB(npos, nvel, 1); // top wall (positive)
		}
		else if (npos.y - this.height/2 < -height/2) {
			this.collideWallTB(npos, nvel, -1); // bottom wall (negative)
    }
    

		//proceeds movement after checking for potential wall hits
		this.velocity.copy(nvel);
		this.position.copy(npos);
  }
  checkCollisions(ob) {
		var ourPos = this.position;
		var objPos = ob.position;
		var dist = ourPos.distanceTo(objPos);
		//Considering a sphere around each object if sum of radiuses is less than distance between both centers, a collision is detected
		if(dist <= this.radius + ob.radius) {
			//Collision treatment is handled by the object
			this.treatCollision(ob);
		}
	}

  myType(){
    return "Object";
  }



}

class Wall extends THREE.Object3D {
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
      this.ball_position = [55, 5, -30];
    }
    else if (rotY == Math.PI/16){
      this.ball_position = [55, 5, -55];
    }
    else if (rotY == -Math.PI/16) {
      this.ball_position = [55, 5, -5];
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
    this.width = 8;
		this.height = 8;
		this.radius = 4;
    this.velocity.set( (2 * Math.random() ) - 1 , 0  , (2 * Math.random() )).normalize().multiplyScalar(0.5);
    this.maxvel.set(1,1,1);
    this.minvel.set(-1,-1,-1);
    createBall(this, x, y, z);
  }


  collideWallLR(npos, nvel, side) { // side = -1 -> left / side = 1 -> right
		npos.setX( (width/2 - this.width/2) * side);
		nvel.setX(nvel.x * -1);
		return npos, nvel;
	}

	collideWallTB(npos, nvel, side) { // side = -1 -> bottom / side = 1 -> top
		npos.setY( (height/2 - this.height/2) * side);
		nvel.setY(nvel.y * -1);
		return npos, nvel;
	}

	treatCollision(obj){
		//Alien-Alien collision should make them go the opposite direction
		if(obj.myType() == "alien"){
			this.velocity.multiplyScalar(-1);
			obj.velocity.multiplyScalar(-1);
		}
		//Alien-Bullet collision should make both Bullet and Alien dissapear
		if(obj.myType() == "bullet"){
			objectsgroup.remove(obj);
			objectsgroup.remove(this);
		}
  }
  myType(){
    return "Ball";
  }

}


 /* update_position(ticks){
    //var oldvelocity = new THREE.Vector3().copy(this.velocity);
		var oldposition = new THREE.Vector3().copy(this.position);

    //var newvelocity = (oldvelocity.addScaledVector(this.aceleration, delta));

    var newposition = oldposition.add(this.velocity);

    this.position.copy(newposition);

  }*/


  /*Iterates through objectsgroup in search for collisions*/
function handleCollisions() {
	for(var i = 4; i < grupo.children.length-1; i++){
		//j = i + 1 -> important to avoid unecessary checks
		for(var j = i+1; j < grupo.children.length; j++){
			grupo.children[i].checkCollisions(grupo.children[j]);
		}
  }
}
function createBall(obj, x, y, z) {
  'use strict';


  var kmaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: wires });
  var kgeometry = new THREE.SphereGeometry(4, 16 ,12);
  var kmesh = new THREE.Mesh(kgeometry, kmaterial);
  //mesh.position.set(x, y, z);
  obj.add(kmesh);
  //addBall(ball,-20,5,-25);


  obj.position.x = x;
  obj.position.y = y;
  obj.position.z = z;
  contador = contador +1;
  grupo.add(obj);
}



/*function addBall(obj, x, y, z) {
    'use strict';
    geometry = new THREE.SphereGeometry(4, 16 ,12);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y , z);
    obj.add(mesh);
}*/


function createWall(table, x, y, z) {
    'use strict';


    material = new THREE.MeshBasicMaterial({ color: 0x7FFFD4, wireframe: wires });
    addGroundWall(table, 0, -1, -30);
    //material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: wires });
    addSideWall(table, 0, 5, 0);
    addSideWall(table, 0, 5, -60);
    addBackWall(table, -29, 5, -30);

    material = new THREE.MeshBasicMaterial({ color: 0xffe4b5, wireframe: wires });
    material.transparent = true;
    material.opacity =  0;
    addBackWall(table, 29, 5, -30);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
    contador = contador +1;
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
    geometry = new THREE.CubeGeometry(60, 15, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addBackWall(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(2, 15, 60);
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
  contador = contador +1;

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
 

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));


    new Wall(-25,0,0);
    left_cannon = new Cannon(55, 5, -5, -Math.PI/16);
    middle_cannon = new Cannon(55, 5, -30, 0);
    right_cannon = new Cannon(55, 5, -55, Math.PI/16);
    selected_cannon = middle_cannon;
    ball_camera = new Ball (27,0,10);
    new Ball(-10,0,0);
    new Ball(27,0,-5);
    new Ball(27,0,20);
    new Ball(-5, 0, -5);
    scene.add(grupo);

}

//Camara frontal
function createCamera3() {
    'use strict';

    camera1[2] = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 100);
    ball_camera.add(camera1[2]);
    camera1[2].position.set(0, 10, 10);
  
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
        //console.log(grupo.lenght);
        for(var i = 0; i < grupo.children.length; i++){
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
    case 38://forward arrow
        moveForward = true;
        break;
    case 39://right arrow
    case 40://backwards arrow
        moveBackwards = true;
        break;
    case 65: //a
      ball3.translateZ(0.01);
      break;

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
    case 68: //d
          scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
              node.visible = !node.visible;
            }
          });
          break;
    case 32: //spacebar
          bullet = new Ball(75,0,-5);
          balls.push(bullet);
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


function checkMove() {
	var delta = clock.getDelta();

	//Cannon.updatepos(delta);	//Cannon movement

	var i = 4;
  var l = grupo.children.length;
  //console.log(grupo.children);

	while (i < l) {
    console.log(grupo.children[i]);
		grupo.children[i].updatepos(delta); //aliens and bullet movement
		i = i + 1;
		l = grupo.children.length;
	}

	//Checks for collisions of certain objects
	handleCollisions();
}

function render() {
	renderer.render(scene, camera1[active_camera]);
}



function animate() {
  //Renders Scene
  requestAnimationFrame(animate);
  
  checkMove();  
  
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
    createCamera3();
    switch_camera(0);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}
