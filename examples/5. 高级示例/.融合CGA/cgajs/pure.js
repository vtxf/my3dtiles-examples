async function pure() {
    window.addEventListener('message', e => {
        // console.log(e);
        if (!e.data) return;
        if (e.data.type !== 'camera') return;
        const { pos, target, up, fovy } = e.data;
    
        // mainCamera.perspective(fovy, webGPUContext.aspect, 0.01, 5000.0);
        // mainCamera.lookAt(new Vector3(pos[0], pos[2], -pos[1]), new Vector3(target[0], target[2], -target[1]), new Vector3(up[0], up[2], -up[1]));
    
        camera.position.x = pos[0];
        camera.position.y = pos[2];
        camera.position.z = -pos[1];
        camera.up.x = up[0];
        camera.up.y = up[2];
        camera.up.z = -up[1];
        camera.lookAt(new THREE.Vector3(target[0], target[2], -target[1]));
        camera.aspect = document.body.clientWidth / document.body.clientHeight;
        camera.fov = fovy;
        camera.near = 0.01;
        camera.far = 5000.0;
        camera.updateProjectionMatrix();
    });
    
    const editorBtn = document.getElementById('editor_btn');
    const layout = document.getElementById('layout');
    let layoutShow = false;
    editorBtn.onclick = () => {
        layoutShow = !layoutShow;
        if (!layoutShow) {
            layout.style.display = 'none';
        } else {
            layout.style.display = 'block';
        }
    }
}

pure();
