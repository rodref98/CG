var scene1, scene2, renderer, clock;
var camera1,camera2;
var geometry;

var board,sphere,cube,message;

var matList=[];
var meshList=[];

var raio=5;//raio da esfera
var blado=60;//lado do board
var clado=8;//lado do cubo
var max=25;//vel max
var acel=2.5;//aceleracao

var ldist=blado;//distancia max que a point light alcança
var decay=1;//decaimento da point light

var Lflag=0;//flag de calculo da iluminacao
var mov=0;//flag do movimento da bola
var pause=0;//flag de estado de pausa do jogo

var directional;//luz direcional
var point;//pointlight

var camFactor=150;

var controls;

class App{

	createScenes() {
		'use strict';

		scene1 = new THREE.Scene();
		//scene1.add(new THREE.AxesHelper(20)); //azul->z, verde->y, vermelho-> x

		ge.createObjects();
		scene1.add(board);
		sphere.rotateY(Math.PI/2);//coloca a bola ao lado do cubo
		scene1.add(sphere);
		scene1.add(cube);
		directional.target=sphere;
		scene1.add(directional);

		/*var helper = new THREE.DirectionalLightHelper( directional, 5 );

		scene1.add( helper );*/

		scene1.add(point);


		scene2 = new THREE.Scene();
		scene2.add(message);

}

	createCamera() {
		'use strict';

		camera1 = new THREE.PerspectiveCamera(10,window.innerWidth / window.innerHeight,1,1000);
		camera1.position.x = 0;
		camera1.position.y = 350;
		camera1.position.z = 250;
		camera1.lookAt(scene1.position);

		camera2= new THREE.OrthographicCamera(innerWidth/ -camFactor, innerWidth/  camFactor,innerHeight/camFactor, innerHeight/ -camFactor, 1,1000 );

		camera2.position.x = 100;
		camera2.position.y = 0;
		camera2.position.z = 27;
		camera2.lookAt(scene2.position);


	}

	createLights(){
		directional= new THREE.DirectionalLight(0xffffff,.7);
		directional.position.set(1,1,0);//posicao que faz um ang de 45º com a normal ao board

		point= new THREE.PointLight(0xffffff,0.7,ldist,decay);
		if(raio>clado){
			point.position.set(0,raio+5,0);
		}
		else{
			point.position.set(0,clado+5,0);
		}
	}



}

class GraphicalEntity extends THREE.Object3D{

	constructor(){
		super();
	}

	createObjects(){
		board=new Board(0,0,0);
		sphere= new Sphere(0,raio,blado/3);
		cube= new Cube(0,clado-1.1,0);
		message= new Message(0,0,0);

	}

	createMaterials(obj,colorhash,texture,bump_map,shine){
		obj.userData={basic:new THREE.MeshBasicMaterial({color: colorhash,wireframe:false, map:new THREE.TextureLoader().load( texture )}),
						phong: new THREE.MeshPhongMaterial({color:colorhash,wireframe:false, specular:colorhash, shininess:shine,map:new THREE.TextureLoader().load( texture ), bumpMap:new THREE.TextureLoader().load(bump_map)})}

		matList.push(obj.userData.phong);
		matList.push(obj.userData.basic);
	}

	createMaterials2(obj,colorhash,texture,shine){
		obj.userData={basic:new THREE.MeshBasicMaterial({color: colorhash,wireframe:false, map:new THREE.TextureLoader().load( texture )}),
						phong: new THREE.MeshPhongMaterial({color:colorhash,wireframe:false, specular:colorhash, shininess:shine,map:new THREE.TextureLoader().load( texture )})}
	
		matList.push(obj.userData.phong);
		matList.push(obj.userData.basic);
	}


}

class Sphere extends GraphicalEntity{

	constructor(x,y,z){
		super();
		this.createSphere(x,y,z);
	}



	createSphere(x,y,z){
		var geometry = new THREE.SphereGeometry(raio, 30, 30);
		var sph=new THREE.Object3D();
		this.createMaterials2(sph,0xffffff,"textures/ball3.jpg",100);//very shininess

		var material=sph.userData.phong;
		var mesh = new THREE.Mesh(geometry, material);
		sph.add(mesh);
		sph.add(new THREE.AxesHelper(10));
		meshList.push(mesh);
		sph.position.set(x,y,z);
		this.add(sph);
		this.userData.vel=0;
	}


}

class Board extends GraphicalEntity{

	constructor(x,y,z){
		super();
		this.createBoard(x,y,z);
	}

	createBoard(x,y,z){
		var brd= new THREE.Object3D();
		var geometry = new THREE.BoxGeometry(blado, .1, blado);
		this.createMaterials(brd,0xffffff,"textures/chessboard.png", "textures/chessbump.png",5);	//not very shininess
		var material=brd.userData.phong;
		var mesh = new THREE.Mesh(geometry, material);
		brd.add(mesh);
		meshList.push(mesh);
		brd.position.set(x,y,z);
		this.add(brd);
	}


}

class Cube extends GraphicalEntity{

	constructor(x,y,z){
		super();
		this.createCube(x,y,z);
	}

	createMaterials(obj,shine){	//overload da funcao de graphical entity
		var faceListP=[
			new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false,map:new THREE.TextureLoader().load( "textures/dice_face_2.png" ),bumpMap:new THREE.TextureLoader().load("textures/dice_face_2.png")}),
			new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_3.png" ),bumpMap:new THREE.TextureLoader().load("textures/dice_face_3.png" )}),
			new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_1.png" ),bumpMap:new THREE.TextureLoader().load("textures/dice_face_1.png" )}),
			new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_4.png" ),bumpMap:new THREE.TextureLoader().load("textures/dice_face_4.png")}),
			new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_5.png" ),bumpMap:new THREE.TextureLoader().load("textures/dice_face_5.png" )}),
			new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_6.png" ),bumpMap:new THREE.TextureLoader().load("textures/dice_face_6.png")})
		];

		var faceListB=[
			new THREE.MeshBasicMaterial({color: 0xffffff,wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_2.png" )}),
			new THREE.MeshBasicMaterial({color: 0xffffff,wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_3.png" )}),
			new THREE.MeshBasicMaterial({color: 0xffffff,wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_1.png" )}),
			new THREE.MeshBasicMaterial({color: 0xffffff,wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_4.png" )}),
			new THREE.MeshBasicMaterial({color: 0xffffff,wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_5.png" )}),
			new THREE.MeshBasicMaterial({color: 0xffffff,wireframe:false, map:new THREE.TextureLoader().load( "textures/dice_face_6.png" )})
		];
		for(var i=0;i<faceListB.length;i++){
			matList.push(faceListB[i]);
			matList.push(faceListP[i]);
		}

		obj.userData={basic: faceListB, phong:faceListP};
	}

	createCube(x,y,z){
		var cb= new THREE.Object3D();
		var geometry = new THREE.BoxGeometry(clado, clado, clado);
		geometry.rotateZ(Math.PI/4);
		geometry.rotateX(Math.PI/4);
		this.createMaterials(cb,5);
		var material=cb.userData.phong;
		var mesh = new THREE.Mesh(geometry, material);
		cb.add(mesh);
		meshList.push(mesh);
		cb.position.set(x,y,z);
		this.add(cb);
	}


}

class Message extends GraphicalEntity{
	constructor(x,y,z){
		super();
		this.createMessage(x,y,z);
	}

	createMessage(x,y,z){
		var msg= new THREE.Object3D();
		var geometry= new THREE.PlaneGeometry(blado,blado/5.5);
		var material= new THREE.MeshBasicMaterial({color:0xffffff, wireframe:false, map:new THREE.TextureLoader().load( "textures/pause2.jpg" )});
		var mesh= new THREE.Mesh(geometry,material);
		msg.add(mesh);
		msg.position.set(x,y,z);
		this.add(msg);
	}

}

function onKeyDown(e) {
		'use strict';
		if(e.keyCode==83 || e.keyCode==115){//S s
			if(pause==0){//se nao estiver em pausa
				pause=1;
				controls.enabled=false;
			}
			else if(pause==1){//se estiver em pausa
				pause=0;
				controls.enabled=true;
			}
			onResize();
		}

		if(pause==1){
			if(e.keyCode==82 || e.keyCode==114){//R r
				createGame();
				controls.object=camera1;
				controls.enabled=true;
				onResize();
			}
		}
		if(pause==0){
			switch (e.keyCode) {
				case 66://B
				case 98: //b
					if(mov==0){
						mov=1;
					}
					else if(mov==1){
						mov=0;
					}
					break;

				case 68://D
				case 100://d
					directional.visible=!directional.visible;
					break;

				case 76://L
				case 108://l
					var len=meshList.length;
					if(Lflag==0){//desativa calculo iluminacao
						Lflag=1;
						for(var i=0;i<len;i++){
							meshList[i].material=meshList[i].parent.userData.basic;
						}

					}
					else if (Lflag==1){//ativa calculo de iluminacao
						Lflag=0;
						for(var i=0;i<len;i++){
							meshList[i].material=meshList[i].parent.userData.phong;
						}

					}
					break;

				case 80://P
				case 112://p
					point.visible=!point.visible;
					break;



				case 87://W
				case 119://w
					for(var i=0;i<matList.length;i++){
						matList[i].wireframe=!matList[i].wireframe;
					}
					break;
			}
		}

}


function onResize() {
		'use strict';
		if(pause==1){//orthographic
			renderer.setSize(window.innerWidth, window.innerHeight);
			if(window.innerWidth!=screen.width || window.innerHeight!=screen.height){//se a janela nao tiver as proporcoes iniciais
				var novo_fact=camFactor*window.innerWidth*window.innerHeight/(screen.width*screen.height);//calcula se um novo camFactor
				camera2.left= -window.innerWidth/novo_fact;
				camera2.right=window.innerWidth/novo_fact;
				camera2.top= window.innerHeight/novo_fact;
				camera2.bottom=-window.innerHeight/novo_fact;
			}

			else if(window.innerWidth==screen.width && window.innerHeight==screen.height){
				camera2.left= -window.innerWidth/camFactor;
				camera2.right=window.innerWidth/camFactor;
				camera2.top= window.innerHeight/camFactor;
				camera2.bottom=-window.innerHeight/camFactor;
			}
			camera2.updateProjectionMatrix();
		}

		else if(pause==0){//perspective
			renderer.setSize(window.innerWidth, window.innerHeight);
			camera1.aspect = window.innerWidth / window.innerHeight;
			camera1.updateProjectionMatrix();
		}


		controls.update();//sempre que algo mexe nas dimensoes na camera faz-se update aos controls

}

function render() {
	'use strict';
	if(pause==0){
		renderer.render(scene1, camera1);
	}
	else if(pause==1){
		renderer.render(scene2, camera2);
	}

}

function init() {
	'use strict';
	renderer = new THREE.WebGLRenderer({antialias: true	}); //serve para não ficar pixelizado
	clock = new THREE.Clock();
	renderer.setSize(window.innerWidth, window.innerHeight);// definir o tamanho
	document.body.appendChild(renderer.domElement);//append ao body
	createGame();
	controls = new THREE.OrbitControls(camera1);
	onResize();

	window.addEventListener("resize",onResize);
	window.addEventListener("keydown", onKeyDown);
}

function update(){
		'use strict';
		var delta=clock.getDelta();
		var dist=0;

		cube.rotateY(Math.PI/96);

		if(mov==1 && pause==0){
			if(sphere.userData.vel<max){
				sphere.userData.vel+=acel*delta;
			}
			else{
				sphere.userData.vel=max;
			}

		}

		if(mov==0 && pause==0){
			if(sphere.userData.vel>0){
				sphere.userData.vel-=acel*delta;
			}
			else{
				sphere.userData.vel=0;
			}

		}

		if(pause==0){
			dist+=sphere.userData.vel*delta;//x=v0t
			sphere.children[0].rotateZ(-dist/raio);//roda obj sph que contem mesh		(roda sobre si mesma)
			sphere.rotateY(dist/(blado/3));//roda toda a esfera (anda); blado/3 é o raio da trajetoria

		}


}



function animate() {//ciclo update/display
	'use strict';
	update();

	render();

	requestAnimationFrame(animate);
}

function createGame(){
	matList=[];
	meshList=[];
	mov=0;
	Lflag=0;
	pause=0;
	renderer.clear();

	app.createLights();
	app.createScenes();
	app.createCamera();

	render();

}


app=new App();
ge= new GraphicalEntity();
