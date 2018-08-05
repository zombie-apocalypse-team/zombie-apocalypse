import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import global from '../entities/global'

const VIEW_ANGLE = 35;
const NEAR = 0.1;
const FAR = 5000;

export default class Graphon {

    constructor(window, sizer) {
        this.window = window;
        this._sizer = sizer;
        this._updateCallbacks = [];
    }

    get playground() {
        return this.renderer.domElement;
    }

    get renderer() {
        return this._renderer
    }

    get sizer() {
        return this._sizer
    }

    get camera() {
        return this._camera
    }

    initGraph() {
        this.initRenderer();
        this.initCamera();
        this.initOnResize();
        this.initScene();

        this.window.document.body.appendChild(this.playground);
    }

    initScene() {
        this._scene = new Scene();
    }

    initOnResize() {
        this._sizer.addOnResize(() => {
                this.playground.width = this._sizer.screenWidth;
                this.playground.height = this._sizer.screenHeight;

                this._renderer.setSize(this._sizer.screenWidth, this._sizer.screenHeight);
                this._camera.aspect = this._sizer.screenWidth / this._sizer.screenHeight;
                this._camera.updateProjectionMatrix();
            }
        );
    }

    initRenderer() {
        this._renderer = new WebGLRenderer({antialias: true});
        this._renderer.setClearColor(0xdddddd, 1);
        this._renderer.setSize(this._sizer.screenWidth, this._sizer.screenHeight);
        this._renderer.shadowMap.enabled = true;
    }

    initCamera() {
        this._camera = new PerspectiveCamera(VIEW_ANGLE, this._sizer.screenWidth / this._sizer.screenHeight, NEAR, FAR);
        this._camera.position.z = 1500;
    }

    addDynamic(addMe) {
        this._scene.add(addMe.sceneObject);
        this._updateCallbacks.push(addMe.onSceneUpdate);
    }

    addStatic(addMe) {
        this._scene.add(addMe);
    }

    update() {
        this._camera.position.x = global.playerSettings.x;
        this._camera.position.y = global.playerSettings.y;
        this._updateCallbacks.forEach(function (callback) {
            callback.call()
        });
        this._renderer.render(this._scene, this._camera);
    }
}