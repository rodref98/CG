/*global THREE, requestAnimationFrame, console*/

var camera1, scene, renderer;

var geometry, material, mesh;

var cilinder, torus, artic;

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

function createTargetBase(x, y, z) {
    'use strict';
    
    cilinder = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.CylinderGeometry(10, 10, 30, 32);
    mesh = new THREE.Mesh(geometry, material);
    
    cilinder.add(mesh);
    cilinder.position.set(x, y, z);
    
    scene.add(cilinder);
}

function createTargetTorus(x, y, z){
    'use strict';

    torus = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
    geometry = new THREE.TorusGeometry( 5, 0.8, 16, 50 );
    torus = new THREE.Mesh( geometry, material );

    torus.add(mesh);
    torus.position.set(x, y, z);

    scene.add(torus);
}


function createArtic(x, y, z){
    artic = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
    geometry = new THREE.SphereBufferGeometry(5, 8, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);
    material.side = THREE.DoubleSide;
    artic = new THREE.Mesh(geometry, material);

    artic.add(mesh);
    artic.position.set(x, y, z);

    scene.add(artic);
}


function createTable(x, y, z) {
    'use strict';
    
    var table = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
   
    addTableTop(table, -25, 0, 0);
    addTableLeg(table, -50, 0, -8);
    addTableLeg(table, -50, 0, 8);
    addTableLeg(table, 0, 0, 8);
    addTableLeg(table, 0, 0, -8);
    
    scene.add(table);
    
    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    

    scene.add(new THREE.AxisHelper(10));
    
    createTargetTorus(45, 30, 0);
    createArtic(-25, 2, 0);
    createTable(0, 0, 0);
    
    createTargetBase(45, 10, 0);
    
    
}

function createCamera() {
    'use strict';

    camera1 = new THREE.PerspectiveCamera(70,
                                            window.innerWidth / window.innerHeight,
                                            1,
                                            1000);

    
    camera1.position.x =0;
    camera1.position.y = 0;
    camera1.position.z = 100;
    //camera.lookAt(scene.position);
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


