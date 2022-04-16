import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls }from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { VertexNormalsHelper } from "../node_modules/three/examples/jsm/helpers/VertexNormalsHelper.js";

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
    const rawPositions = [
      -1,-1,0,
      1,-1,0,
      -1,1,0,
      1,1,0
    ];

    const rawNormals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    const rawColors = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
      1, 1, 0
    ];

    const rawUv = [
      0, 0,
      1, 0,
      0, 1,
      1, 1
    ];

    const positions = new Float32Array(rawPositions);
    const normals = new Float32Array(rawNormals);
    const colors = new Float32Array(rawColors);
    const uvs = new Float32Array(rawUv);

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals,3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs,2));

    geometry.setIndex([
      0,1,2,
      2,1,3
    ]);

    //geometry.computeVertexNormals();

    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("./uv_grid_opengl.jpg");
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff, 
      //vertexColors: true, 
      map: map
    });

    const box = new THREE.Mesh(geometry,material);
    this._scene.add(box);

    const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
    this._scene.add(helper);
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
