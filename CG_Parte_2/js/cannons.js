/*global THREE, requestAnimationFrame, console*/



var camera1 = new Array(3);
var active_camera = 0;

var scene, renderer;
var wires = true;
var grupo = new THREE.Group();
var contador = 0;
var geometry, material, mesh;
var meshes = [];
var Axiscont = 0;
var Axisvec = [];
var Axistf = true;
var table, left_cannon, middle_cannon, right_cannon, ball_camera;
var selected_cannon;
var matrix_rotate;

var x_limit = 60;
var z_limit = 62;
var ratio = 2.07;
var scale = 0.013

var clock = new THREE.Clock();

class Base_Object extends THREE.Object3D{
  constructor(){
    super();
		this.velocity = new THREE.Vector3();
		this.aceleration = new THREE.Vector3();
		this.maxvelocity = new THREE.Vector3();
		this.minvelocity = new THREE.Vector3();
		this.x_limit = 0;
		this.z_limit = 0;
		this.radius = 0;
	}

  updatepos(delta) {
		var oldvel = new THREE.Vector3().copy(this.velocity);
		var oldpos = new THREE.Vector3().copy(this.position);

		// v = a * delta; limits velocity within a maximum and minimum value
		var nvel = (oldvel.addScaledVector(this.aceleration , (-delta))).clamp(this.minvelocity, this.maxvelocity);
		// x = x0 + v
		var npos = oldpos.add(nvel);

		/*Checks if object will hit a Wall/Limit before it happens and acts accordingly*/
		if (npos.x - this.x_limit/2 < -x_limit/2) {
			this.collideBackWall(npos, nvel, -1); // left wall (negative)
		}
		else if (npos.x + this.x_limit/2 > (x_limit+20)/2) {
			grupo.remove(this); // right wall (positive)
		}
		else if (npos.z + this.z_limit/2 > z_limit/2) {
			this.collideSideWall(npos, nvel, 1); // top wall (positive)
		}
		else if (npos.z - this.z_limit/2 < -z_limit/2) {
			this.collideSideWall(npos, nvel, -1); // bottom wall (negative)
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
    this.velocitysetX = -0.5;
    this.velocitysetZ = 0;
    if (this.rotY == 0){
      this.ball_position = [32, 4, 0];
    }
    else if (this.rotY == Math.PI/16){
      this.ball_position = [32, 4, -20];
    }
    else if (this.rotY == -Math.PI/16) {
      this.ball_position = [32, 4, 20];
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
    this.velocitysetX -= 0.03;
    this.velocitysetZ += 0.03;
    this.ball_position[2] -= -1;
  }
  toggleRightMovement(){
    selected_cannon.rotateX(-0.05);
    this.velocitysetX += 0.03;
    this.velocitysetZ -= 0.03;
    this.ball_position[2] += -1;
  }
  shootBall(){
    this.ball = new Ball(this.ball_position[0], this.ball_position[1], this.ball_position[2]);
    this.ball.position.set(this.ball_position[0], this.ball_position[1], this.ball_position[2]);
    this.ball.velocity.set(this.velocitysetX, 0, this.velocitysetZ);
  }

  myType(){
    return "Cannon";
  }
}

class Ball extends Base_Object {
  constructor(x, y, z){
    super();
    this.x_limit = 8;
		this.z_limit = 8;
		this.radius = 4.2;
    this.velocity.set( (50 * Math.random() )  , 0  , (50 * Math.random() )).normalize().multiplyScalar(1);
    //this.aceleration.set(0, 0, 0);
    this.maxvelocity.set(10,10,10);
    this.minvelocity.set(-5,-5,-5);
    this.index = Axiscont;
    Axisvec[this.index] = new THREE.AxisHelper(7);
    Axiscont ++;
    this.add(Axisvec[this.index]);
    createBall(this, x, y, z);
  }


  collideBackWall(npos, nvel, side) { // side = -1 -> left / side = 1 -> right
		npos.setX( (x_limit/2 - this.x_limit/2) * side);
		nvel.setX(nvel.x * -1);
		return npos, nvel;
	}

	collideSideWall(npos, nvel, side) { // side = -1 -> bottom / side = 1 -> top
		npos.setZ( (z_limit/2 - this.z_limit/2) * side);
		nvel.setZ(nvel.z * -1);
		return npos, nvel;
  }
  toggleoffAxisHelper(){
    this.remove(Axisvec[this.index]);
  }
  toggleonAxisHelper(){
    this.add(Axisvec[this.index]);
  }

	treatCollision(obj){
		//Ball-Ball collision should make them go the opposite direction
		if(obj.myType() == "Ball"){
      var aux = this.velocity;
      this.velocity = obj.velocity;
      //console.log(aux);
      this.maxvelocity.set(0.02,0, 0.02);
      //this.minvelocity.set(-0.02,0,-0.02);
      obj.velocity= aux;
		}
		//Ball-FinalWall collision should make Ball dissapear
		if(obj.myType() == "Wall" && obj.mesh.material.color == 0xFF0000){
      console.log(obj.myType());
			objectsgroup.remove(this);
		}
  }
  myType(){
    return "Ball";
  }

}



  /*Iterates through group in search for collisions*/
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
  var kgeometry = new THREE.SphereGeometry(3.8, 16 ,12);
  var kmesh = new THREE.Mesh(kgeometry, kmaterial);

  //obj.add(new THREE.AxisHelper(7));
  obj.add(kmesh);


  obj.position.x = x;
  obj.position.y = y;
  obj.position.z = z;
  contador = contador +1;
  grupo.add(obj);
}



function createWall(table, x, y, z) {
    'use strict';


    material = new THREE.MeshBasicMaterial({ color: 0x7FFFD4, wireframe: wires });
    addGroundWall(table, 0, 0, 0);
    //material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: wires });
    addSideWall(table, 0, 5, -30);
    addSideWall(table, 0, 5, 30);
    addBackWall(table, -29, 5, 0);

    material = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: wires });
    material.transparent = true;
    material.opacity =  0;
    addBackWall(table, 40, 5, 0);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
    contador = contador +1;
    grupo.add(table);
}



function addGroundWall(obj, x, y, z) {
  'use strict';
  geometry = new THREE.CubeGeometry(60, 0, 62);
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

  matrix_rotate[0] = 1;
  matrix_rotate[1] = 0;
  matrix_rotate[2] = 0;
  matrix_rotate[3] = 0;

  matrix_rotate[4] = 0;
  matrix_rotate[5] = Math.cos(x);
  matrix_rotate[6] = -Math.sin(x);
  matrix_rotate[7] = 0;

  matrix_rotate[8] = 0;
  matrix_rotate[9] = Math.sin(x);
  matrix_rotate[10] = Math.cos(x);
  matrix_rotate[11] = 0;

  matrix_rotate[12] = 0;
  matrix_rotate[13] = 0;
  matrix_rotate[14] = 0;
  matrix_rotate[15] = 1;





}
function rotate() {
  var result = new Float32Array(16);
  var resultb = new Float32Array(16);
  var resultMatrix = new THREE.Matrix4();
  var resultMatrixb = new THREE.Matrix4();
  var q1 = new THREE.Quaternion();
  var v1 = new THREE.Vector3(0, 1, 0);


  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var sum = 0;
      var sumb = 0;
      for (var k = 0; k < 4; k++) {
        if (undefined != meshes[0].matrix.elements){
        sum += meshes[0].matrix.elements[4*i+k] * matrix_rotate[4*k+j];
        sumb += meshes[1].matrix.elements[4*i+k] * matrix_rotate[4*k+j];
        }
      }
      result[4*i+j] = sum;
      resultb[4*i+j] = sumb;
    }
  }
  resultMatrix.set(result[0], result[1], result[2], result[3],
                  result[4], result[5], result[6], result[7],
                  result[8], result[9], result[10], result[11],
                  result[12], result[13], result[14], result[15]);
  console.log(resultMatrix);
  /*meshes[0].matrix.set(result[0], result[1], result[2], result[3],
                  result[4], result[5], result[6], result[7],
                  result[8], result[9], result[10], result[11],
                  result[12], result[13], result[14], result[15]);*/
  q1.setFromAxisAngle(v1, Math.PI/2);
  middle_cannon.quaternion.multiply(q1);
  selected_cannon.matrix.multiply(resultMatrix);
  console.log(selected_cannon.matrix)
  //middle_cannon.matrix.rotateByAxis(v1, Math.PI/16);
  meshes[1].matrix = resultMatrixb;
  //console.log(meshes[0].matrix);
  //console.log(meshes[0].matrix.elements);

}


function createScene() {
    'use strict';

    scene = new THREE.Scene();

    //scene.add(new THREE.AxisHelper(100));


    new Wall(0,0,0);
    left_cannon = new Cannon(51, 4, 25, -Math.PI/16);
    middle_cannon = new Cannon(51, 4, 0, 0);
    right_cannon = new Cannon(51, 4, -25, Math.PI/16);
    selected_cannon = middle_cannon;
    new Ball(-20,4,0);
    new Ball(20,4,0);
    new Ball(-15, 4, 15);
    ball_camera = new Ball(15, 4, 15);
    //create_matrixR(Math.PI/16);
    //rotate();
    scene.add(grupo);

}

//Camara frontal
function createCamera3() {
    'use strict';

    camera1[2] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100);

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


function checkMove() {
	var delta = clock.getDelta();

	//Cannon.updatepos(delta);	//Cannon movement

	var i = 4;
  var l = grupo.children.length;
  //console.log(grupo.children);
  //console.log(grupo.children);
	while (i < l) {

		grupo.children[i].updatepos(delta); //Balls movement
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
