/*global THREE, requestAnimationFrame, console*/


var camera1 = new Array(2);
var active_camera = 0;

var scene, renderer;
var wires = true;
var geometry, material, mesh;
var grupo = new THREE.Group();
var table;
var directional_light;
var holofote2;
var material_array;
var material_counter = 0;

class Base_Object extends THREE.Object3D{
  constructor(){
    super();
	}

  changeMaterial(material){
    this.children[0].material = material;
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

class Painting extends Base_Object{
    constructor(x, y, z){
        super();
        createPainting(this, x, y, z);
    }
    myType(){
        return "Painting";
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
  geometry = new THREE.CubeGeometry(80, 2, 80);
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

function createWall(table, x, y, z) {
    'use strict';


    material = new THREE.MeshBasicMaterial({ color: 0x667C26, wireframe: wires });
    addGroundWall(table, 0, 0, 40);
    addBackWall(table, 0, 30, 1);
    addPedestalLeg(table, 0, 10, 45);
    addPedestalTop(table, 0, 20, 45);
    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
    grupo.add(table);
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
    //material = new THREE.MeshLambertMaterial( { color:0xff0000} );
    addHolofoteCone(index, 0, 10, 0);
    addHolofoteArtic(index, 0, 14, 0);

    index.rotation.z = Math.PI/2;
    index.rotation.y = -Math.PI/2;
    index.position.x = x;
    index.position.y = y;
    index.position.z = z;
    grupo.add(index);
}
function onOroffLight(){
  var state = !directional_light.visible;
  directional_light.visible = state;
}
function createPainting(obj,x,y,z){
    'use strict';

    addSquares(obj);
}

function initMaterials(){
    material_array = new Array(3);
    material_array[0] = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: wires });
    material_array[1] = new THREE.MeshLambertMaterial({ color: 0xFFFFFF});
    material_array[2] = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 30 });
}



function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));
    initMaterials();

    new Triangle(20,0,20);
    new Wall(0,0,0);
    new Holofote(-25, 25, 30);
    holofote2 = new Holofote(-10, 25, 30);
    new Holofote(5, 25, 30);
    new Holofote(20, 25, 30);
    directional_light = new THREE.DirectionalLight(0xffffff, 1);
    directional_light.position.set(0, 20, 50);
    directional_light.castShadow = true;
    scene.add(directional_light);
    scene.add(grupo);
    //directional_light.target = grupo.children[1];
    //console.log(grupo.children[1]);

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

  camera1[1] = new THREE.PerspectiveCamera( 65, 1920/1080, 1, 1000);


  camera1[1].position.x = 40;
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
    case 37://left arrow
        break
    case 39://right arrow
        if(material_counter < 2)
          material_counter++;
        else {
          material_counter = 0;
        }
        console.log(material_counter);
        for(var i = 0; i < grupo.children.length; i++){
          for (var j = 0; j < grupo.children[i].children.length; j++){
            grupo.children[i].children[j].material = material_array[material_counter];
          }
        }
        break
    case 69:  //E
          break;
    case 81: //Q
          onOroffLight();
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