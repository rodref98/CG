
var camera, scene, renderer;

var geometry, material, mesh;

// funçoes da base
function createBaseBody(x,y,z){}

function createWheel(x,y,x){}

function createArticulation(x,y,z){} // funçao da articulaçao




// funçoes da mao
function createFinger(x,y,z){}



// funçoes do alvo
function createBaseTarget(x,y,z){}

function createTargetTop(x,y,z){}




// funçoes de criaçao gerais
function createRobotBase(x,y,z){}

function createArm(x,y,z){}

function createHand(x,y,z){}

function createTarget(x,y,z){}

function createScene(){
    scene = new Tree.Scene();
    scene.add(new TREE.AxisHelper(20));

    /* falta funçoes que criam o robot em si*/ 
}

function createCamera(){
    camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);
}




function init(){}