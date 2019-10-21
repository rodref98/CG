/*global THREE, requestAnimationFrame, console*/
//Primeira entrega grupo 30



var camera1 = new Array(3);
var active_camera = 0;

var fullrobot = new THREE.Object3D();
var moveForward = false;
var moveBackwards = false;
var breakFB = false;

var scene, renderer;

var geometry, material, mesh;

var table, target, arm;
function addTableLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.SphereGeometry(2, 6, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
}

function addTableTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(40, 2, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTargetBase(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(7, 7, 30, 32);
    mesh = new THREE.Mesh(geometry, material);

    obj.add(mesh);
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

function addTargetTorus(obj, x, y, z){
    'use strict';

    material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
    geometry = new THREE.TorusGeometry( 5, 1, 16, 50 );
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x, y, z);
    mesh.rotation.y = Math.PI / 2;
    obj.add(mesh);


}


function addTableArtic1(obj, x, y, z){

    material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
    geometry = new THREE.SphereBufferGeometry(3, 8, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);
    material.side = THREE.DoubleSide;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);


}


function addArm1(obj,x,y,z){
    'use strict';
    material = new THREE.MeshBasicMaterial({ color:0x8CA38C , wireframe: true });
    geometry = new THREE.CubeGeometry(2, 22, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addArm2(obj,x,y,z){
    'use strict';
    material = new THREE.MeshBasicMaterial({ color:0x8CA38C , wireframe: true });
    geometry = new THREE.CubeGeometry(22,2,2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHand(obj,x,y,z){
    'use strict';
    material = new THREE.MeshBasicMaterial({ color:0x8CA38C , wireframe: true });
    geometry = new THREE.CubeGeometry(1,10,2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addArmArtic(obj,x,y,z){
    material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
    geometry = new THREE.SphereBufferGeometry(2, 8, 6, 0);
    material.side = THREE.DoubleSide;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);

}

function addHandArtic(obj,x,y,z){
    material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
    geometry = new THREE.SphereBufferGeometry(2, 8, 6, 0);
    material.side = THREE.DoubleSide;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addFinger(obj,x,y,z){
    'use strict';
    material = new THREE.MeshBasicMaterial({ color:0x8CA38C , wireframe: true });
    geometry = new THREE.CubeGeometry(8,1,1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createRobotBase(x, y, z) {
    'use strict';

    table = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x8CA38C, wireframe: true });

    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -15, 0, -8);
    addTableLeg(table, -15, 0, 8);
    addTableLeg(table, 15, 0, 8);
    addTableLeg(table, 15, 0, -8);
    addTableArtic1(table, 0, 1, 0);


    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
    fullrobot.add(table);
}
function createTarget(x, y, z) {
    'use strict';

    target = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x1E90FF, wireframe: true });

    addTargetBase(target, 0, 10, 0);
    addTargetTorus(target, 0, 30, 0);


    scene.add(target);

    target.position.x = x;
    target.position.y = y;
    target.position.z = z;
}
function createArm(x,y,z){
    arm = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color:0xff8533 , wireframe: true });

    addArm1(arm,0,12,0);
    addArm2(arm,12,24,0);
    addHand(arm,26,24,0);
    addFinger(arm,30,27,0);
    addFinger(arm,30,21,0);
    addHandArtic(arm,24,24,0);
    addArmArtic(arm,0,24,0);


    arm.position.x = x;
    arm.position.y = y;
    arm.position.z = z;
    fullrobot.add(arm);
}

function createFullRobot(x, y, z){
  scene.add(fullrobot);

  fullrobot.position.x = x;
  fullrobot.position.y = y;
  fullrobot.position.z = z;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(100));


    createRobotBase(-25, 0, 0);
    createTarget(55, 0, 0);
    createArm(-25,0,0);
    createFullRobot(0, 0, 0);

}
//Camara frontal
function createCamera3() {
    'use strict';

    camera1[2] = new THREE.OrthographicCamera( -70, 70, 40, -40, 1, 1000 );


    camera1[2].position.x = 0;
    camera1[2].position.y = 100;
    camera1[2].position.z = 70;
    //camera1[2].rotation.x = 90;
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

    camera1[0] = new THREE.OrthographicCamera( -70, 70, 40, -40, 1, 1000 );


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
        camera1.updateProjectionMatrix();
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
    case 50: //2
        switch_camera(1);
        break;

    case 49: //1
        switch_camera(0);
        break;

    case 51: //3
        switch_camera(2);
        break;

    case 37://left arrow
        fullrobot.rotateY(0.05);
        break;
    case 38://forward arrow
        moveForward = true;
        break;
    case 39://right arrow
        fullrobot.rotateY(-0.05);
        break;
    case 40://backwards arrow
        moveBackwards = true;
        break;
    case 65: //a
        arm.rotateY(0.05);
        break;
    case 81: //q
        arm.rotateZ(0.05);
        break;
    case 83: //s
        arm.rotateY(-0.05);
        break;
    case 87: //w
        arm.rotateZ(-0.05);
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
function checkMove() {

  if (moveForward){
    fullrobot.translateX(1);
  }

  else if (moveBackwards){
    fullrobot.translateX(-1);
  }

  else if (breakFB){
    fullrobot.translateX(0);
  }
}
function render() {
	renderer.render(scene, camera1[active_camera]);
}



function animate() {
	//Checks for keyboard input for movement
    checkMove();
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
