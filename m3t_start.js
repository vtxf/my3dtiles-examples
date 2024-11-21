/**
 * @typedef {Object} MyTreeItemContentJsonType
 * @property {'sceneObjJson'|'sceneObjJsonUri'|'m3toJson'|'m3toJsonUri'|'m3tJson'|'m3tJsonUri'|'script'|'scriptUri'} type - The type of content
 * @property {*} [sceneObjJson] - Scene object JSON data
 * @property {string} [sceneObjJsonUri] - URI to scene object JSON
 * @property {*} [m3toJson] - M3TO JSON data
 * @property {string} [m3toJsonUri] - URI to M3TO JSON
 * @property {*} [m3tJson] - M3T JSON data
 * @property {string} [m3tJsonUri] - URI to M3T JSON
 * @property {string} [script] - Script content
 * @property {string} [scriptUri] - URI to script
 */

/**
 * @typedef {Object} MyTreeItemJsonType
 * @property {string} name - The name of the tree item
 * @property {string} [path] - Script language  新加的属性
 * @property {boolean} [collapsed] - Whether the tree item is collapsed
 * @property {string} [previewImageUri] - Whether the tree item is collapsed
 * @property {MyTreeItemContentJsonType} [content] - The content of the tree item
 * @property {MyTreeItemJsonType[]} [children] - Child tree items
 */

(async () => {
    const currentScript = document.currentScript;
    if (!currentScript) {
        console.warn("无法获取当前脚本元素的路径！");
        return;
    }

    const scriptPath = currentScript.src;
    if (!scriptPath || scriptPath === "") {
        console.warn("无法获取当前脚本元素的路径！");
        return;
    }

    console.log("当前脚本路径:", scriptPath);

    // 获取脚本所在目录的路径
    const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf("/") + 1);
    console.log("脚本所在目录路径:", scriptDir);

    /**
     * 
     * @param {MyTreeItemJsonType} item
     * @param {string} currentPath
     */
    function convertPathForItems(item, currentPath = '') {
        let path = currentPath;
        if (item.path && typeof item.path === 'string') {
            path += item.path + '/';
        }
        do {
            if (item.previewImageUri) {
                item.previewImageUri = item.previewImageUri.replaceAll('${M3T_CurrentDir}', path);
            }

            const { content } = item;
            if (!content) break;
            if (content.m3tJsonUri) {
                content.m3tJsonUri = content.m3tJsonUri.replaceAll('${M3T_CurrentDir}', path);
            }
            if (content.m3toJsonUri) {
                content.m3toJsonUri = content.m3toJsonUri.replaceAll('${M3T_CurrentDir}', path);
            }
            if (content.sceneObjJsonUri) {
                content.sceneObjJsonUri = content.sceneObjJsonUri.replaceAll('${M3T_CurrentDir}', path);
            }
        } while (false);

        if (!item.children) return;

        for (const child of item.children) {
            convertPathForItems(child, path);
        }
    }

    const creatorUiFunc = async app => {
        // 加载脚本所在目录下面的m3t_list.json文件
        const m3tListJsonResponse = await fetch(scriptDir + "m3t_list.json");
        if (!m3tListJsonResponse.ok) {
            console.warn("无法加载m3t_list.json文件！");
            return;
        }

        const m3tListJson = await m3tListJsonResponse.json();
        // console.log("m3t_list.json内容:", m3tListJson);
        /** @type MyTreeItemJsonType */
        const root = m3tListJson.list.root;
        convertPathForItems(root, scriptDir);

        /** @type {MyTreeItemJsonType[]} */
        const items = [...app.creatorUi.items, root];
        app.creatorUi.items = items;
    }

    const createButtonFunc = (app) => {
        const buttonJson = {
            "type": "RectangleButton",
            "name": "通知按钮",
            "containerId": "m3t_info_div",
            "width": 0,
            "height": 32,
            "backgroundColor": [0.1, 0.1, 0.1, 0],
            "borderWidth": 0,
            "cssText": "cursor: pointer;\nline-height: 32px;\npadding: 0 4px;",
            "clickFuncStr": "\nfunction(mouseEvent) {\n    window.open(`https://p.czmtoy.com/m3t/examples/web/`);\n}\n",
            "statusFuncStr": "function (status, sceneObject) {\n    const ratioMap = {\n        normal: 0.1,\n        hovered: 0.3,\n        pressed: 0.35,\n    };\n    const r = ratioMap[status];\n\n    sceneObject.backgroundColor = [r, r, r, 0];\n    sceneObject.textColor = [0.9+r, 0.9+r, 0.9+r, 1];\n}\n",
            "text": "示例集合",
            "fontSize": 12,
            "textLayoutType": "None"
        };
        const 通知按钮 = app.xe2ProjectManager.createSceneObjectFromJson(buttonJson);
        app.dispose(() => app.xe2ProjectManager.destroySceneObject(通知按钮));
    }

    const m3tAppCreatedFunc = app => {
        creatorUiFunc(app);
        createButtonFunc(app);
    };

    const registFunc = () => window.__m3tRegisterCreatedFunc && window.__m3tRegisterCreatedFunc(m3tAppCreatedFunc);
    if (!window.__m3tRegisterCreatedFunc) {
        const origin_m3tLoadedFunc = window.__m3tLoadedFunc;
        window.__m3tLoadedFunc = () => {
            origin_m3tLoadedFunc && origin_m3tLoadedFunc();
            registFunc();
        }
    } else {
        registFunc();
    }
})();