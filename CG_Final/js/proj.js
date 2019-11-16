/*global THREE, requestAnimationFrame, console*/


var camera1 = new Array(2);
var active_camera = 0;

var sculpturemovement = true;
var scene, renderer;
var wires = true;
var geometry, material, mesh;
var grupo = new THREE.Group();
var directional_light,spotlight1,spotlight2,spotlight3,spotlight4;
var material_array;
var material_counter = 0;

//Textures
var chess = 'textures/chess2.png';

class Base_Object extends THREE.Object3D{
  constructor(){
    super();
	}

  calcLight(){
    if(this.myType() != "Painting" && this.myType() != "Spotlight" && this.myType() != "Pedestal" && this.myType() != "Sculpture"){
      for (var j = 0; j < this.children.length; j++){
        this.children[j].material = material_array[material_counter];
      }
    }

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



function addGroundWall(obj, x, y, z) {
  'use strict';
  geometry = new THREE.CubeGeometry(80, 0.1, 80);
  var texture = new THREE.TextureLoader().load(chess);
  var material2 = new THREE.MeshBasicMaterial( { map: texture, transparent: true} );


  mesh = new THREE.Mesh(geometry, material2);
  //mesh.receiveShadow = true;
  mesh.position.set(x, y, z);
  //mesh.receiveShadow = true;
  obj.add(mesh);
}


function createWall(obj, x, y, z) {
  'use strict';


  material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: wires });
  addGroundWall(obj, 0, 0, 0);

  obj.position.x = x;
  obj.position.y = y;
  obj.position.z = z;
  grupo.add(obj);
}


function onOroffLight(){
  'use strict';

  var state = !directional_light.visible;
  directional_light.visible = state;
}



function toggleWireframe() {
	wires = !wires;

	for (var mat of sculpturemat) {
		mat.wireframe = wires;
	}
}

function initMaterials(){
  'use strict';

    material_array = new Array(3);
    var texture = new THREE.TextureLoader().load(chess);
    material_array[0] = new THREE.MeshBasicMaterial( { map: texture, transparent: true} );
    material_array[1] = new THREE.MeshLambertMaterial({ map: texture, transparent: true});


}

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    initMaterials();

    new Wall(0,0,0);

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


  camera1[1].position.x = 0;
  camera1[1].position.y = 45;
  camera1[1].position.z = 100;
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
    case 54: //6
        switch_camera(0);
        break;

    case 53: //5
        switch_camera(1);
        break;
    case 68: //D
        onOroffLight();
        break;
    case 76: //l
          if(material_counter < 1)
            material_counter++;
          else {
            material_counter = 0;
          }
          for(var i = 0; i < grupo.children.length; i++){
            grupo.children[i].calcLight();
          }
          break;
    case 87: //W
          wires = !wires;
          //console.log(grupo.lenght);
          for(var i = 0; i < grupo.children.length-1; i++){
            for (var j = 0; j < grupo.children[i].children.length; j++){
              //console.log(grupo.children[i].myType());
              grupo.children[i].children[j].material.wireframe= wires;
            }
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
    createCamera2();
    createCamera3();
    switch_camera(1);


    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}
