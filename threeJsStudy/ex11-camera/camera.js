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
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,   //zNear
      100    //zFar
    );

    // const aspect = window.innerWidth/window.innerHeight;
    // const camera = new THREE.OrthographicCamera(
    //   -10*aspect, 10*aspect,  //xLeft, xRight
    //   10, -10,    //yTop, yBottom
    //   0.1, 100  //zNear, zFar
    // )
    // camera.zoom = 0.25;

    camera.position.set(7,7,0);
    camera.lookAt(0,0,0);
    this._camera = camera;
  }

  _setupLight() {
    const light = new THREE.SpotLight(0xffffff, 1); //색상, 세기
    light.position.set(0,5,0);
    light.target.position.set(0,0,0);
    light.angle = THREE.Math.degToRad(40);  //광원이 만드는 각도
    light.penumbra = 1;                   //빛의 감쇄율   0~1
    this._scene.add(light.target);

    const helper = new THREE.SpotLightHelper(light);
    this._scene.add(helper);
    this._helper = helper;

    this._scene.add(light);
    this._light = light;
  }

  _setupModel() {
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: "#2c3e50",
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry,groundMaterial);
    ground.rotation.x = THREE. Math.degToRad(-90);
    this._scene.add(ground);

    const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
    const bigSphereMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.1,
      matalness: 0.2,
    });
    const bigSphere = new THREE.Mesh(bigSphereGeometry,bigSphereMaterial);
    bigSphere.rotation.x = THREE.Math.degToRad(-90);
    this._scene.add(bigSphere);

    const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: "#9b59b6",
      roughness: 0.5,
      metalness: 0.9
    });

    for(let i = 0; i < 8; i++){
      const torusPivot = new THREE.Object3D();
      const torus = new THREE.Mesh(torusGeometry,torusMaterial);
      torusPivot.rotation.y = THREE.Math.degToRad(45 * i);
      torus.position.set(3, 0.5, 0);
      torusPivot.add(torus);
      this._scene.add(torusPivot);
    }

    const smallSphereGeomatry = new THREE.SphereGeometry(0.3, 32, 32);
    const smallSphereMaterial = new THREE.MeshStandardMaterial({
      color: "#e74c3c",
      roughness: 0.2,
      matalness: 0.5
    });
    const smallSpherePivot = new THREE.Object3D();
    const smallSphere = new THREE.Mesh(smallSphereGeomatry,smallSphereMaterial);
    smallSpherePivot.add(smallSphere);
    smallSpherePivot.name = "smallSpherePivot";
    smallSphere.position.set(3, 0.5, 0);
    this._scene.add(smallSpherePivot);

    const targetPivot = new THREE.Object3D();
    const target = new THREE.Object3D();
    targetPivot.add(target);
    targetPivot.name = "targetPivot";
    target.position.set(3, 0.5, 0);
    this._scene.add(targetPivot);
  }

  resize(){
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const aspect = width / height;

    if(this._camera instanceof THREE.PerspectiveCamera){
      this._camera.aspect = aspect;
    }else {
      this._camera.left = -1*aspect; //xLeft
      this._camera.right = 1*aspect; //xRight
    }

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
   
    const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
    if(smallSpherePivot){
      smallSpherePivot.rotation.y = THREE.Math.degToRad(time*50);

      const smallSphere = smallSpherePivot.children[0];
      smallSphere.getWorldPosition(this._camera.position);
      const targetPivot = this._scene.getObjectByName("targetPivot");
      if(targetPivot) {
        targetPivot.rotation.y=THREE.Math.degToRad(time*50 + 10);

        const target = targetPivot.children[0];
        const pt = new THREE.Vector3();

        target.getWorldPosition(pt);
        this._camera.lookAt(pt);
      }


      if(this._light.target){
        const smallSphere = smallSpherePivot.children[0];  //smallsphere얻어오기
        smallSphere.getWorldPosition(this._light.target.position); //월드 좌표 위치 지정

        if(this._lightHelper) this._lightHelper.update();  
      }
    }
  }
}

window.onload = function() {
  new App();
}
