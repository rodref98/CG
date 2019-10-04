/*global THREE, requestAnimationFrame, console*/



var camera1 = new Array(3);
var active_camera = 0;



var scene, renderer;

var geometry, material, mesh;

var table, target;
function addTableLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.SphereGeometry(2, 6, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
}

function addTableTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(60, 2, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTargetBase(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(10, 10, 30, 32);
    mesh = new THREE.Mesh(geometry, material);

    obj.add(mesh);
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

function addTargetTorus(obj, x, y, z){
    'use strict';

    material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
    geometry = new THREE.TorusGeometry( 5, 0.8, 16, 50 );
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x, y, z);
    obj.add(mesh);


}


function addTableArtic1(obj, x, y, z){

    material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
    geometry = new THREE.SphereBufferGeometry(5, 8, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);
    material.side = THREE.DoubleSide;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);


    //scene.add(artic);
}


function createTable(x, y, z) {
    'use strict';

    table = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -25, 0, -8);
    addTableLeg(table, -25, 0, 8);
    addTableLeg(table, 25, 0, 8);
    addTableLeg(table, 25, 0, -8);
    addTableArtic1(table, 0, 1, 0);

    scene.add(table);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}
function createTarget(x, y, z) {
    'use strict';

    target = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

    addTargetBase(target, 0, 10, 0);
    addTargetTorus(target, 0, 30, 0);


    scene.add(target);

    target.position.x = x;
    target.position.y = y;
    target.position.z = z;
}


function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(100));


    createTable(-25, 0, 0);
    createTarget(55, 0, 0);



}

function createCamera() {
    'use strict';

    camera1[0] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);


    camera1[0].position.x =0;
    camera1[0].position.y = 0;
    camera1[0].position.z = 100;
    camera1[0].lookAt(scene.position);
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
        camera1.position.x = 0;
        camera1.position.y = 20;
        camera1.position.z = 75;
        camera1.lookAt(scene.position);
        break;

    case 49: //1
        camera1.position.x =0;
        camera1.position.y = 100;
        camera1.position.z = 25;
        camera1.lookAt(scene.position);
        break;

    case 37://left arrow
        table.rotateY(-0.5);
        break;
    case 38://forward arrow
    case 39://right arrow
        table.rotateY(0.5);
        break;
    case 69:  //E
    case 101: //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
        break;
    }
    render();
}

function render() {
    'use strict';
    renderer.render(scene, camera1);
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
    camera1.lookAt(scene.position);

    render(camera1);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}
