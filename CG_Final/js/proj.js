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


class Wall extends Base_Object {
  constructor(x, y, z){
    super();
    createWall(this, x, y, z);
  }

  myType(){
    return "Wall";
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
  addGroundWall(obj, 0, 0, 0);

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

    /*sculpturemat = new Array(3);
	  sculpturemat[0] = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: !wires });
	  sculpturemat[1] = new THREE.MeshLambertMaterial( {color: 0x00ff00});
	  sculpturemat[2] = new THREE.MeshPhongMaterial( {color: 0x00ff00, shininess: 100});*/
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

    new Wall(0,0,0);
    /*spotlight1 = new Spotlight(20, 20, 100, 0, 30, 0);
    spotlight1.rotateX(Math.PI/12);
    spotlight2 = new Spotlight(100, 40, 30, 70, 20, 20);
    spotlight2.rotateX(Math.PI/3);
    spotlight3 = new Spotlight(-30, 25, 90, 10 , 10, 10);
    spotlight3.rotateX(-Math.PI/6);
    spotlight4 = new Spotlight(40, 25, 90, 10 ,10 ,0);
    spotlight4.rotateX(Math.PI/12);*/

  
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
    case 71:  //E
          toggleWireframe();
          break;
    case 69: //G
          if(material_counter < 2)
            material_counter++;
          else {
            material_counter = 0;
          }
          console.log(material_counter);
          for(var i = 0; i < grupo.children.length; i++){
            grupo.children[i].changeMaterial();
          }
          break
    case 81: //Q
          onOroffLight();
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
