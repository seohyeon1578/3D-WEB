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
    const geometry = new THREE.BoxGeometry(1, 1, 1,2,2,2);
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
