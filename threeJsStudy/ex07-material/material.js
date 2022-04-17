import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls }from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

class App {
  constructor() {
    const divContainer = document.getElementById("container");
    this._divContainer = divContainer;  //다른 메서드에서 사용할 수 있도록

    const randerar = new THREE.WebGLRenderer({ antialias: true });
    randerar.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(randerar.domElement);
    this._randerar = randerar;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      100
    );
    camera.position.z = 3;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupModel() {
    // MeshBasicMaterial
    // const material = new THREE.MeshBasicMaterial({
    //   visible: true,   //렌더링시 메시가 보일지
    //   transparent: true, //opacity 사용 여부
    //   opacity: 0.5,    //0~1
    //   depthTest: true,    
    //   depthWrite: true,
    //   side: THREE.FrontSide, //앞면만 랜더링 할지 뒷면만할지 앞면뒷면 둘다 할지

    //   color: "yellow",
    //   wireframe: false   //선형태로 할지
    // });

    // MeshLamberMaterial
    // const material = new THREE.MeshLambertMaterial({
    //   transparent: true,
    //   opacity: 0.5,
    //   side: THREE.DoubleSide,

    //   color: 0xff0000,
    //   emissive: 0x555500,     //광원에 영향을 받지않는 재질자체의 색상
    //   wireframe: false 
    // });
    
    // MeshPhongMaterial
    // const material = new THREE.MeshPhongMaterial({
    //   color: 0xff0000,
    //   emissive: 0x000000,     //광원에 영향을 받지않는 재질자체의 색상
    //   specular: 0xffff00,      //광원에의해 반사되는 색상
    //   shininess: 10,           //반사되는 정도
    //   flatshading: false,       //mesh를 평평하게 할지
    //   wireframe: false 
    // });

    //MeshStandardMaterial
    // const material = new THREE.MeshStandardMaterial({
    //   color: 0xff0000,
    //   emissive: 0x000000,     //광원에 영향을 받지않는 재질자체의 색상
    //   roughness: 0.25,           //거칠기   0~1
    //   metalness: 1,           //금속성  
    //   flatshading: false,      
    //   wireframe: false 
    // });

    //MeshPhysicalMaterial
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      emissive: 0x00000,     //광원에 영향을 받지않는 재질자체의 색상
      roughness: 1,           //거칠기   0~1
      metalness: 0,           //금속성  
      clearcoat: 1,             //코팅 0~1
      clearcoatRoughness: 0,    //코팅에 대한 거칠기 0~1
      flatshading: false,      
      wireframe: false 
    });
    const box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),material);
    box.position.set(-1,0,0);
    this._scene.add(box);
    
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32),material);
    sphere.position.set(1,0,0);
    this._scene.add(sphere);
    
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._randerar.setSize(width, height);
  }

  render(time) {
    this._randerar.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001;
  }
}

window.onload = function() {
  new App();
}
