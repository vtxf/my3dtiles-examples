function init() {
    let xe2BaseDir = './js/';

    do {
        if (!document.currentScript) {
            console.warn(`当前脚本加载时document.currentScript无法获取，可能的原因：加载js文件使用了type="module"。`);
            alert(`当前脚本加载时document.currentScript无法获取，可能的原因：加载js文件使用了type="module"。`);
            break;
        }

        const scriptSrc = document.currentScript.src;
        if (!scriptSrc) {
            break;
        }
        const result = /(.*)[\/\\](.*)/.exec(scriptSrc);
        if (!result || result.length < 3) {
            break;
        }
        xe2BaseDir = result[1] + '/';
    } while (false);

    window.xbsjDirs = window.xbsjDirs || { xe2BaseDir };
}

init();

class Xe2Debug {
    constructor() {
        let xe2Debug = {};
        try {
            if (localStorage.xe2Debug) {
                xe2Debug = JSON.parse(localStorage.xe2Debug);
            }
        } catch (error) {
            console.log(`localStorage.xe2Debug解析出错：${localStorage.xe2Debug}`);
            xe2Debug = {};
        }
        this.xe2Debug = xe2Debug;
    }

    set debug(value) { this.xe2Debug.debug = value; this.apply(); }
    get debug() { return this.xe2Debug.debug ?? false; }
    set debugXe2(value) { this.xe2Debug.debugXe2 = !!value; this.apply(); }
    get debugXe2() { return this.xe2Debug.debugXe2 ?? false; }
    set debugSmplotting(value) { this.xe2Debug.debugSmplotting = !!value; this.apply(); }
    get debugSmplotting() { return this.xe2Debug.debugSmplotting ?? false; }
    set debugEsobjs(value) { this.xe2Debug.debugEsobjs = !!value; this.apply(); }
    get debugEsobjs() { return this.xe2Debug.debugEsobjs ?? false; }
    set debugCesium(value) { this.xe2Debug.debugCesium = !!value; this.apply(); }
    get debugCesium() { return this.xe2Debug.debugCesium ?? false; }
    set debugRenderer(value) { this.xe2Debug.debugRenderer = !!value; this.apply(); }
    get debugRenderer() { return this.xe2Debug.debugRenderer ?? false; }
    set debugMy3dtilesLib(value) { this.xe2Debug.debugMy3dtilesLib = !!value; this.apply(); }
    get debugMy3dtilesLib() { return this.xe2Debug.debugMy3dtilesLib ?? false; }
    set extJsPaths(value) { this.xe2Debug.extJsPaths = value; this.apply(); }
    get extJsPaths() { return this.xe2Debug.extJsPaths ?? []; }
    apply() { localStorage.xe2Debug = JSON.stringify(this.xe2Debug); }
}

const g_xe2Debug = new Xe2Debug();
window.g_xe2Debug = g_xe2Debug;

function setupXe2() {
    document.write(`<script src="https://czmtoy.com/apps/my3dtiles/misc/m3tPreload.js"><\/script>\n`);

    const { xe2BaseDir } = window.xbsjDirs;

    let useDefault = true;

    do {
        const xe2Debug = g_xe2Debug;

        if (!xe2Debug.debug) break;
        let scriptListStr = ``;

        window.xbsjDirs = window.xbsjDirs || {};

        if (xe2Debug.debugCesium) {
            window.xbsjDirs.cesiumDir = "http://localhost:8080/Build/CesiumUnminified/";
        }

        if (xe2Debug.debugRenderer) {
            window.xbsjDirs.xbsjRendererDir = "http://localhost:8210/";
        }

        if (xe2Debug.debugXe2) {
            scriptListStr += `<script src="http://localhost:8212/xe2-all-in-one.js"><\/script>\n`;
        } else {
            scriptListStr += `<script src="${xe2BaseDir}vtxf-xe2/dist-web/xe2-all-in-one.js"><\/script>\n`;
        }

        scriptListStr += `<script src="${xe2BaseDir}vtxf-xe2-assets/dist-web/xe2-assets.js"><\/script>\n`;
        scriptListStr += `<script src="${xe2BaseDir}my3dtiles-assets/dist-web/my3dtiles-assets.js"><\/script>\n`;
        scriptListStr += `<script src="${xe2BaseDir}vue-xe2-plugin/dist-web/vue-xe2-plugin.js"><\/script>\n`;

        if (xe2Debug.debugSmplotting) {
            scriptListStr += `<script src="http://localhost:8194/smplotting-m3t-plugin.js"><\/script>\n`
        } else {
            scriptListStr += `<script src="${xe2BaseDir}smplotting-m3t-plugin/dist-web/smplotting-m3t-plugin.js"><\/script>\n`;
        }

        if (xe2Debug.debugMy3dtilesLib) {
            scriptListStr += `<script src="http://localhost:8191/my3dtiles-lib.js"><\/script>\n`;
        } else {
            scriptListStr += `<script src="${xe2BaseDir}my3dtiles-lib/dist-web/my3dtiles-lib.js"><\/script>\n`;
        }

        // scriptListStr += `<script src="${xe2BaseDir}esobjs-xe2-plugin-assets/dist-web/esobjs-xe2-plugin-assets.js"><\/script>\n`;
        // if (xe2Debug.debugEsobjs) {
        //     scriptListStr += `<script src="http://localhost:8195/esobjs-xe2-plugin.js"><\/script>\n`
        // } else {
        //     scriptListStr += `<script src="${xe2BaseDir}esobjs-xe2-plugin/dist-web/esobjs-xe2-plugin.js"><\/script>\n`
        // }

        if (xe2Debug.extJsPaths) {
            do {
                if (!xe2Debug.extJsPaths) {
                    console.warn(`xe2Debug.extJsPaths不存在！`);
                    break;
                }

                if (!Array.isArray(xe2Debug.extJsPaths)) {
                    console.warn(`xe2Debug.extJsPaths不是数组结构！`, xe2Debug.extJsPaths);
                    break;
                }

                try {
                    for (const extJsPath of xe2Debug.extJsPaths) {
                        if (typeof extJsPath !== 'string') {
                            console.warn(`xe2Debug.extJsPaths错误，extJsPath不是字符串`, extJsPath);
                            continue;
                        }
                        scriptListStr += `<script src="${extJsPath}"><\/script>\n`
                    }
                } catch (error) {
                    console.error(`xe2Debug.extJsPaths使用时报错！`);
                    console.error(error);
                }
            } while (false);
        }

        document.write(scriptListStr);
        useDefault = false;
    } while (false);

    if (useDefault) {
        document.write(`\
        <script src="${xe2BaseDir}vtxf-xe2/dist-web/xe2-all-in-one.js"><\/script>
        <script src="${xe2BaseDir}vtxf-xe2-assets/dist-web/xe2-assets.js"><\/script>
        <script src="${xe2BaseDir}my3dtiles-assets/dist-web/my3dtiles-assets.js"><\/script>
        <script src="${xe2BaseDir}vue-xe2-plugin/dist-web/vue-xe2-plugin.js"><\/script>
        <script src="${xe2BaseDir}smplotting-m3t-plugin/dist-web/smplotting-m3t-plugin.js"><\/script>
        <script src="${xe2BaseDir}my3dtiles-lib/dist-web/my3dtiles-lib.js"><\/script>
      `);

    //   <script src="${xe2BaseDir}esobjs-xe2-plugin-assets/dist-web/esobjs-xe2-plugin-assets.js"><\/script>
    //   <script src="${xe2BaseDir}esobjs-xe2-plugin/dist-web/esobjs-xe2-plugin.js"><\/script>
    }
}

setupXe2();

class DebugInfoUI {
    constructor() {
        const xe2Debug = g_xe2Debug;

        function createDiv(labelName, propName) {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = xe2Debug[propName];
            input.onchange = ev => {
                xe2Debug[propName] = input.checked;
            };
            const label = document.createElement('label');
            label.innerText = labelName;
            const div = document.createElement('div');
            div.appendChild(input);
            div.appendChild(label);
            return div;
        }

        const legend = document.createElement('legend');
        legend.innerText = '开发调试(Ctrl+F12)';
        const div0 = createDiv('总开关', 'debug');
        const div1 = createDiv('Xe2', 'debugXe2');
        const div2 = createDiv('Smplotting', 'debugSmplotting');
        const div3 = createDiv('ESobjs', 'debugEsobjs');
        const div4 = createDiv('Cesium', 'debugCesium');
        const div5 = createDiv('Renderer', 'debugRenderer');
        const div6 = createDiv('my3dtiles-lib', 'debugMy3dtilesLib');
        const reloadButton = document.createElement('button');
        reloadButton.innerText = '刷新';
        reloadButton.onclick = () => {
            xe2Debug.apply();
            location.reload();
        }
        reloadButton.style.margin = '4px 4px 0 4px';
        reloadButton.title = `如果发现控制台加载报错，很可能是要调试某项目没有运行起来！`;

        const hideButton = document.createElement('button');
        hideButton.innerText = '隐藏';
        hideButton.onclick = () => {
            this.show = false;
        }
        hideButton.style.margin = '4px 4px 0 4px';
        hideButton.title = `隐藏以后，可以通过Ctrl+F12来显示本窗口`;

        const addJSButton = document.createElement('button');
        addJSButton.innerText = '添加js脚本';
        addJSButton.onclick = () => {
            this.showWindow = true;
        }
        addJSButton.style.margin = '4px 4px 0 4px';
        addJSButton.style.display = "block"
        addJSButton.title = `打开弹出框添加js脚本`;

        const vessel = document.createElement('div');
        vessel.style.cssText = `
        width: 400px;
        height: auto;
        position:absolute;
        left:-${(document.documentElement.clientWidth / 2)}px;
        top:${(document.documentElement.clientHeight / 2)}px;
        transform: translate(50%, -50%);
        background-color:#bfbfbf;
        display:none;
        `

        const box = document.createElement('div')
        box.style.cssText = `
        position: relative;
        width: 92%;
        height: auto;
        margin:4%;
        `

        const pathLists = document.createElement('div')
        pathLists.style.cssText = `
        width: 100%;
        height: 100%;
        `

        const close = document.createElement('div')
        close.innerText = 'x'
        close.style.cssText = `
        position: absolute;
        right: -5px;
        top: -15px;
        font-size: 20px;
        cursor: pointer;
        `
        close.onclick = () => {
            this.showWindow = false;
        }
        
        const updata = () => {
            xe2Debug.extJsPaths.forEach((e, i) => {
                const list = document.createElement("div")
                list.style.cssText = `
                width: 100%;
                height: 30px;
                display: flex;
                justify-content: space-around;
                padding:5px 0;
                `
                const path = document.createElement("input")
                path.value = e
                path.style.cssText = `
                width: 70%;
                pointer-events: none;
                `

                const del = document.createElement("div")
                del.innerText = 'x'
                del.style.cssText = `
                font-size: 20px;
                cursor: pointer;
                `
                del.onclick = () => {
                    const paths = [...xe2Debug.extJsPaths]
                    paths.splice(i, 1)
                    xe2Debug.extJsPaths = [...paths]
                    pathLists.removeChild(list)
                }
                list.appendChild(path)
                list.appendChild(del)

                pathLists.appendChild(list)
            });
        }
        updata()

        const add = document.createElement("button")
        add.innerText = '+'
        add.style.cssText = `
        width: 60px;
        display: block;
        font-size: 16px;
        cursor: pointer;
        margin-left: 50%;
        transform: translate(-50%, 0);
        margin-top:10px;
        `
        add.onclick = () => {
            const JSPath = prompt("JS文件路径", "http://www.czmtoy.com/xxx.js");
            if (!JSPath) return;
            const paths = [...xe2Debug.extJsPaths]
            const rep = paths.find(e => e === JSPath)
            // 如果js文件存在就不添加了
            if (rep) return;
            paths.push(JSPath)
            xe2Debug.extJsPaths = [...paths]
            pathLists.innerHTML = ""
            updata()
        }

        vessel.appendChild(box)
        box.appendChild(close)
        box.appendChild(pathLists)
        box.appendChild(add)

        const fieldset = document.createElement('fieldset');
        fieldset.appendChild(legend);
        fieldset.appendChild(div0);
        fieldset.appendChild(div1);
        fieldset.appendChild(div2);
        fieldset.appendChild(div3);
        fieldset.appendChild(div4);
        fieldset.appendChild(div5);
        fieldset.appendChild(div6);
        fieldset.appendChild(reloadButton);
        fieldset.appendChild(hideButton);
        fieldset.appendChild(addJSButton);
        fieldset.appendChild(vessel);

        const div = document.createElement('div')
        div.style.position = 'absolute';
        div.style.right = '10px';
        div.style.top = '10px';
        div.style.background = 'rgba(200, 200, 0, 0.95)';
        div.style.zIndex = '9999';  //确保调试在最上面
        div.appendChild(fieldset);

        div.style.display = !!xe2Debug.debug ? 'block' : 'none';

        document.body.appendChild(div);

        this._div = div;
        this._vessel = vessel

    }

    set show(value) {
        this._div.style.display = value ? 'block' : 'none';
    }

    get show() {
        return this._div.style.display === 'block';
    }

    set showWindow(value) {
        this._vessel.style.display = value ? 'block' : 'none';
    }

    get showWindow() {
        return this._vessel.style.display === 'block';
    }
}

function showDebugInfo() {
    const debugInfoUI = new DebugInfoUI();
    window.g_debugInfoUI = debugInfoUI;

    // 按键 Ctrl + F12 后，开启或者关闭调试面板
    document.addEventListener('keyup', ev => {
        if (ev.ctrlKey && ev.key === 'F12') {
            debugInfoUI.show = !debugInfoUI.show;
        }
    });
}

document.addEventListener('DOMContentLoaded', showDebugInfo);
