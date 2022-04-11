import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls }from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js';

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
    camera.position.x = -15;
    camera.position.z = 15;
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
    //shape
    //const shape = new THREE.Shape();
    //const x = -2.5, y = -5;
    //shape.moveTo(x+2.5,y+2.5);
    //shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    //shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    //shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    //shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    //shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    //shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    
    //curve
    // class CustomSinCurve extends THREE.Curve {
    //   constructor(scale) {
    //     super();
    //     this.scale = scale;
    //   }
    //   getPoint(t) {
    //     const tx = t * 3 - 1.5;
    //     const ty = Math.sin(2 * Math.PI * t);
    //     const tz = 0;
    //     return new THREE.Vector3(tx,  ty, tz).multiplyScalar(this.scale);
    //   }
    // }
    //const path = new CustomSinCurve(4);
    
    //lathe
    // const points = [];
    // for (let i = 0; i < 10; ++i) {
    //   points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3,(i-5) * .8));
    // }

    //extrude
    // const shape = new THREE.Shape();
    // const x = -2.5, y = -5;
    // shape.moveTo(x+2.5,y+2.5);
    // shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    // shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    // shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    // shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    // shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    // shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);   
    // const setting = {
    //   steps: 2, //깊이 방향 분할 수
    //   depth: 4, //깊이
    //   bevelEnabled: true, //bevel처리
    //   bevelThickness: 1.6,
    //   bevelSize: 1.5,
    //   bevelSegments: 6,
    // };

    //text
    const fontLoader = new FontLoader();
    async function loadFont(that) {
      const url = "../node_modules/three/examples/fonts/helvetiker_regular.typeface.json";
      const font = await new Promise((resolve, reject) => {
        fontLoader.load(url, resolve, undefined, reject);
      });
      const geometry = new TextGeometry("HELLO", {
        font: font, 
        size: 9,
        height: 1.8,
        curveSegments: 5,  //커브 정점의 개수
        //setting for ExtrudeGeometry
        bevelEnabled: true,
        bevelThickness: 1.5, //두께
        bevelSize: 1.7,      //거리 값
        bevelSegments: 7     //단계수
      });
      const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151});
      const cube = new THREE.Mesh(geometry,fillMaterial);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00});
      const line = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry), lineMaterial
      );

      const group = new THREE.Group();
      group.add(cube);
      group.add(line);

      that._scene.add(group);
      that._cube = group;

    };
    loadFont(this);
    //const geometry = new THREE.ShapeGeometry(shape);
    //const geometry = new THREE.TubeGeometry(path, 40, 0.8, 2, true);//(,튜브진행방향 분할 수,원통 반지름,원통 분할 수,닫을지)
    //const geometry = new THREE.LatheGeometry(points, 32, 0, Math.PI); //(,분할 수,시작 각, 연장 각)
    //const geometry = new THREE.ExtrudeGeometry(shape, setting);
    // const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151});
    // const cube = new THREE.Mesh(geometry,fillMaterial);

    // const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00});
    // const line = new THREE.LineSegments(
    //   new THREE.WireframeGeometry(geometry), lineMaterial
    // );

    // const group = new THREE.Group();
    // group.add(cube);
    // group.add(line);

    // this._scene.add(group);
    // this._cube = group;
  }

  // shape
  // _setupModel() {
  //   const shape = new THREE.Shape();
  //   const x = -2.5, y = -5;
  //   shape.moveTo(x+2.5,y+2.5);
  //   shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  //   shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  //   shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  //   shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  //   shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  //   shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    

  //   const geometry = new THREE.BufferGeometry();
  //   const points = shape.getPoints();
  //   geometry.setFromPoints(points);

  //   const material = new THREE.LineBasicMaterial({color: 0xffff00});
  //   const line = new THREE.Line(geometry,material);

  //   this._scene.add(line);
  // }

  //curve
  // _setupModel() {
  //   class CustomSinCurve extends THREE.Curve {
  //     constructor(scale) {
  //       super();
  //       this.scale = scale;
  //     }
  //     getPoint(t) {
  //       const tx = t * 3 - 1.5;
  //       const ty = Math.sin(2 * Math.PI * t);
  //       const tz = 0;
  //       return new THREE.Vector3(tx,  ty, tz).multiplyScalar(this.scale);
  //     }
  //   }

  //   const path = new CustomSinCurve(4);

  //   const geometry = new THREE.BufferGeometry();
  //   const points = path.getPoints(30); //곡선이 부드럽게
  //   geometry.setFromPoints(points);

  //   const material = new THREE.LineBasicMaterial({color: 0xffff00});
  //   const line = new THREE.Line(geometry,material);

  //   this._scene.add(line);
  // }

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
