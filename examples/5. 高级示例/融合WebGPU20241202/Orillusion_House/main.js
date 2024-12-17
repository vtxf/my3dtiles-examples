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
