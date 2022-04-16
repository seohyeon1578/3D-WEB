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
    camera.position.z = 2;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupModel() {
    //const geometry = new THREE.CircleGeometry(0.9,16,Math.PI/2,Math.PI);  //평면 다각형:(반지름,분할 개수.값이 클수록 원의 형태,시작각도, 연장각도)
    //const geometry = new THREE.ConeGeometry(0.5, 1.6, 16, 9, true, 0, Math.PI);  //원뿔:(밑면 반지름 크기, 높이,옆면 분할 개수,높이방향 분할 개수,밑면 thue or false,시작 각도, 연장각도)
    //const geometry = new THREE.CylinderGeometry(0.9, 0.9,1.6, 32,12,true,0,Math.PI);  //원통:(윗면 반지름 크기,밑면 반지름 크기,원통 높이,옆면 분할 개수, 높이 방향 분할 개수,원통 밑면 윗면 열것인지,시작 각도, 연장 각도)
    //const geometry = new THREE.SphereGeometry(0.9, 32,12,0, Math.PI, 0, Math.PI/2);  //구:(구반지름 크기,수평 방향 분할 수,수직 방향 분할 수,수평 방향에 대한 시작 각도, 연장 각도,시작 방향에 대한 시작 각도, 연장각도)
    //const geometry = new THREE.RingGeometry(0.2,1,6,2,0,Math.PI);  //반지:(내부 반지름 값,외부 반지름 값,둘레 분할 수,내부 분할 수,시작 각도, 연장 각도)
    //const geometry = new THREE.PlaneGeometry(1,1.4,1,1);  //평면 사각형(3차원 지형 표현 유용):(너비 길이,높이 길이,너비방향 분할 수,높이방향 분할 수)
    //const geometry = new THREE.TorusGeometry(0.9,0.4,24,32,Math.PI);  //3차원 반지:(반지름,원통 반지름,방사방향 분할 수,긴 원통 분할 수,연장 각의 길이)
    const geometry = new THREE.TorusKnotGeometry(0.6, 0.1, 64, 32, 3, 4);  //*활용도가 떨어짐(반지름,원통의 반지름,분할 수,분할 수,반복 수, 반복 수)
    const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151});
    const cube = new THREE.Mesh(geometry,fillMaterial);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00});
    const line = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry), lineMaterial
    );

    const group = new THREE.Group();
    group.add(cube);
    group.add(line);

    this._scene.add(group);
    this._cube = group;
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._randerar.setSize(width, height);
  }

  render() {
    this._randerar.render(this._scene, this._camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function() {
  new App();
}
