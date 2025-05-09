function initWeb3D() {
    // 获取canvas元素
    const canvas = document.getElementById('renderCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = null; // 设置canvas背景透明

    // 创建相机
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    // 初始相机位置设置
    {
        camera.position.set(5.87119293911729, -7.38644338398808, 4.312101513147354);
        camera.lookAt(new THREE.Vector3(5.260303682185449, -6.661173892669467, 3.9946137480437756));
        camera.up.set(-0.20453188615497309, 0.24282748671934215, 0.9482623683556449);
    }

    window.addEventListener('message', e => {
        if (!e.data) return;
        if (e.data.type !== 'camera') return;
        const { pos, target, up, fovy } = e.data;
        // console.log(`e.data`, e.data);

        camera.fov = fovy;
        camera.updateProjectionMatrix();
        camera.position.set(pos[0], pos[1], pos[2]);
        camera.lookAt(new THREE.Vector3(target[0], target[1], target[2]));
        camera.up.set(up[0], up[1], up[2]);
    });

    // 创建灯光
    // const light = new THREE.HemisphericLight(0xffffff, 0x444444);
    // light.position.set(0, 1, 0);
    // scene.add(light);
    {
        // 创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 3); // 颜色为白色，强度为0.5，强度值可根据实际需求调整
        scene.add(ambientLight);

        // 创建平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // 同样颜色为白色，强度为0.5
        directionalLight.position.set(0, 0, 5); // 设置平行光的位置，这里使其从上方（Y轴正方向）照射
        scene.add(directionalLight);
    }

    // 加载模型
    const loader = new window.GLTFLoader();
    const dracoLoader = new window.DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.load('../../../../shared/data/gltfs/orhouse/orhouse.glb', function (gltf) {
        const rootMesh = new THREE.Group();
        rootMesh.add(gltf.scene);
        rootMesh.scale.set(0.01, 0.01, 0.01);
        rootMesh.position.z += 0.8;
        rootMesh.rotation.x = THREE.MathUtils.degToRad(90); // 绕x轴旋转90度
        scene.add(rootMesh);
    });

    // 初始相机位置设置
    {
        camera.position.set(5.87119293911729, -7.38644338398808, 4.312101513147354);
        camera.lookAt(new THREE.Vector3(5.260303682185449, -6.661173892669467, 3.9946137480437756));
        camera.up.set(-0.20453188615497309, 0.24282748671934215, 0.9482623683556449);
    }

    // 渲染循环
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // 窗口大小改变时的响应
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

}

document.addEventListener('DOMContentLoaded', initWeb3D);