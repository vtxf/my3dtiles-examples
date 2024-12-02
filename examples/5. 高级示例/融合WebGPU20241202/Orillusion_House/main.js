const { Camera3D, OrbitController, DirectLight, Engine3D, View3D, PostProcessingComponent, BloomPost, KelvinUtil, Object3D, Scene3D, GTAOPost, webGPUContext, AtmosphericComponent, Vector3 } = Orillusion;

class Sample_FlightHelmet {
    lightObj;
    cameraObj;
    scene;
    obj;

    async run() {
        await Engine3D.init({
            // canvasConfig: { alpha: true, zIndex: 0, backgroundImage: 'https://cdn.orillusion.com/logo/bg.webp' },
            canvasConfig: { alpha: true, zIndex: 0 },
            renderLoop: this.loop.bind(this)
        });
        // Engine3D.setting.shadow.autoUpdate = true;
        // Engine3D.setting.shadow.updateFrameRate = 1;
        // Engine3D.setting.shadow.shadowBound = 20;
        // Engine3D.setting.shadow.shadowBias = 0.001;
        // Engine3D.setting.render.postProcessing.bloom.luminanceThreshole = 0.8;
        // Engine3D.setting.render.postProcessing.bloom.bloomIntensity = 1;

        Engine3D.setting.shadow.shadowBound = 40;
        Engine3D.setting.shadow.shadowBias = 0.001;
        Engine3D.setting.shadow.shadowSize = 4096;
        Engine3D.setting.shadow.autoUpdate = true;
        // Engine3D.setting.shadow.enable = false;


        this.scene = new Scene3D();
        let camera = new Object3D();
        camera.y = 5;
        camera.z = 20;
        this.scene.addChild(camera);
        let mainCamera = camera.addComponent(Camera3D);
        mainCamera.perspective(90, webGPUContext.aspect, 0.1, 1000.0);
        mainCamera.lookAt(new Vector3(2000, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 1, 0));

        window.addEventListener('message', e => {
            // console.log(e);
            if (!e.data) return;
            if (e.data.type !== 'camera') return;
            const { pos, target, up, fovy } = e.data;

            mainCamera.perspective(fovy, webGPUContext.aspect, 0.01, 5000.0);
            mainCamera.lookAt(new Vector3(pos[0], pos[2], -pos[1]), new Vector3(target[0], target[2], -target[1]), new Vector3(up[0], up[2], -up[1]));
        });

        // let orbit = camera.addComponent(OrbitController);
        // orbit.minDistance = 10;
        // orbit.maxDistance = 30;
        // orbit.panFactor = 0.1;
        // orbit.rotateFactor = 0.3;

        await this.initScene();
        let view = new View3D();
        view.scene = this.scene;
        view.camera = mainCamera;
        Engine3D.startRenderView(view);

        let postProcessing = this.scene.addComponent(PostProcessingComponent);
        postProcessing.addPost(GTAOPost);
        // postProcessing.addPost(BloomPost);
    }

    async initScene() {
        /******** sky *******/
        {
            let sky = this.scene.addComponent(AtmosphericComponent);
            sky.sunY = 0.73;
            sky.sunRadiance = 47;
            sky.enable = false;
        }
        /******** light *******/
        {
            this.lightObj = new Object3D();
            this.lightObj.rotationX = 38;
            this.lightObj.rotationY = 220;
            this.lightObj.rotationZ = 5.58;
            let lc = this.lightObj.addComponent(DirectLight);
            lc.lightColor = KelvinUtil.color_temperature_to_rgb(5355);
            lc.castShadow = true;
            lc.intensity = 5;
            this.scene.addChild(this.lightObj);
        }

        {
            // let obj = (this.obj = await Engine3D.res.loadGltf('https://cdn.orillusion.com/PBR/FlightHelmet/FlightHelmet.gltf'));
            let obj = (this.obj = await Engine3D.res.loadGltf('https://cdn.orillusion.com/gltfs/glb/BuildingWithCharacters/scene.glb'));
            obj.transform.scaleX = 0.01;
            obj.transform.scaleY = 0.01;
            obj.transform.scaleZ = 0.01;
            obj.transform.y = 0.8;
            this.scene.addChild(obj);
        }
    }

    loop() {
        // this.obj.transform.rotationY -= 0.2;
    }
}

new Sample_FlightHelmet().run();



// const { Engine3D, AtmosphericComponent, KelvinUtil, DirectLight, View3D, CameraUtil, HoverCameraController, LitMaterial, MeshRenderer, Object3D, PlaneGeometry, Scene3D } = Orillusion;
// // import { Stats } from '@orillusion/stats';

// // Sample to load glb file
// class Sample_LoadGLB2 {
//     // scene: Scene3D;

//     async run() {
//         Engine3D.setting.shadow.shadowBound = 10;
//         Engine3D.setting.shadow.shadowBias = 0.001;
//         Engine3D.setting.shadow.autoUpdate = true;

//         await Engine3D.init({ 
//             canvasConfig: { alpha: true, zIndex: 0 },
//         });
//         let scene = new Scene3D();
//         scene.exposure = 1;
//         // scene.addComponent(Stats);

//         // init sky
//         // let atmosphericSky: AtmosphericComponent;
//         let atmosphericSky;
//         atmosphericSky = scene.addComponent(AtmosphericComponent);
//         // atmosphericSky.enable = false;

//         // init Camera3D
//         let camera = CameraUtil.createCamera3DObject(scene);
//         camera.perspective(60, Engine3D.aspect, 0.1, 5000);

//         // init Camera Controller
//         let hoverCtrl = camera.object3D.addComponent(HoverCameraController);
//         hoverCtrl.setCamera(-30, -15, 100);

//         // init View3D
//         let view = new View3D();
//         view.scene = scene;
//         view.camera = camera;

//         // create direction light
//         let lightObj3D = new Object3D();
//         lightObj3D.x = 0;
//         lightObj3D.y = 30;
//         lightObj3D.z = -40;
//         lightObj3D.rotationX = 20;
//         lightObj3D.rotationY = 160;
//         lightObj3D.rotationZ = 0;

//         let light = lightObj3D.addComponent(DirectLight);
//         light.lightColor = KelvinUtil.color_temperature_to_rgb(5355);
//         light.castShadow = true;
//         light.intensity = 30;
//         scene.addChild(light.object3D);

//         // relative light to sky
//         atmosphericSky.relativeTransform = light.transform;

//         this.scene = scene;
//         atmosphericSky.displaySun = false;
//         atmosphericSky.sunRadiance = 1;

//         hoverCtrl.setCamera(-45, -45, 10);
//         light.intensity = 5;
//         Engine3D.startRenderView(view);
//         await this.initScene();
//     }

//     async initScene() {
//         /******** load compressed glb by draco *******/
//         let model = await Engine3D.res.loadGltf('https://cdn.orillusion.com/gltfs/glb/BuildingWithCharacters/scene.glb', {
//             onProgress: (e) => this.onLoadProgress(e),
//             onComplete: (e) => this.onComplete(e)
//         });
//         this.scene.addChild(model);
//         model.scaleX = model.scaleY = model.scaleZ = 0.01;
//     }

//     onLoadProgress(e) {
//         console.log(e);
//     }

//     onComplete(e) {
//         console.log(e);
//     }
// }
// new Sample_LoadGLB2().run();
