// 获取canvas元素
const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas, true);

// 创建场景
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // 设置canvas背景透明

// 设置为右手坐标系
scene.useRightHandedSystem = true;

// 创建相机
const camera = new BABYLON.FreeCamera("Camera", BABYLON.Vector3.Zero(), scene);
// camera.attachControl(canvas, true);
// 设置相机的近裁和远裁
camera.minZ = 0.01;
camera.maxZ = 5000;

// 初始相机位置设置
{
    camera.fov = BABYLON.Tools.ToRadians(70);
    camera.position = new BABYLON.Vector3(6.454080615661778, 6.377902589742007, 3.9602961614727974);
    camera.setTarget(new BABYLON.Vector3(5.804354174531736, 5.719789407685312, 3.579845651984215));
    camera.upVector = new BABYLON.Vector3(-0.2672885352198342, -0.27073867394813395, 0.9248012810160037);
}

window.addEventListener('message', e => {
    if (!e.data) return;
    if (e.data.type !== 'camera') return;
    const { pos, target, up, fovy } = e.data;
    console.log(`e.data`, e.data);

    camera.fov = BABYLON.Tools.ToRadians(fovy);
    camera.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
    camera.setTarget(new BABYLON.Vector3(target[0], target[1], target[2]));
    camera.upVector = new BABYLON.Vector3(up[0], up[1], up[2]);
});

// 创建灯光
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

BABYLON.SceneLoader.ImportMesh("", "../../../../shared/data/gltfs/orhouse/", "orhouse.glb", scene, function (meshes) {
    const rootMesh = new BABYLON.Mesh("root", scene);
    meshes.forEach(mesh => {
        mesh.parent = rootMesh;
    });
    rootMesh.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
    rootMesh.position.z += 0.8;
    rootMesh.rotation.x = BABYLON.Tools.ToRadians(90); // 绕x轴旋转90度
});

// 渲染循环
engine.runRenderLoop(() => {
    scene.render();
});

// 窗口大小改变时的响应
const resizeObserver = new ResizeObserver(() => {
    engine.resize();
});
resizeObserver.observe(canvas);
