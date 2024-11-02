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

    // 加载脚本所在目录下面的m3t_list.json文件
    const m3tListJsonResponse = await fetch(scriptDir + "m3t_list.json");
    if (!m3tListJsonResponse.ok) {
        console.warn("无法加载m3t_list.json文件！");
        return;
    }

    const m3tListJson = await m3tListJsonResponse.json();
    // console.log("m3t_list.json内容:", m3tListJson);


    // const 


    const creatorUiFunc = app => {
        const 海水json = {
            "type": "SceneScript",
            "name": "Czm海水",
            "createAppendedObjFuncStr": "function (sceneObject) {\r\n    // 创建primitive\r\n    function createPrimitive(viewer) {\r\n        const { getStrFromEnv } = XE2['xe2-base-objects'].SceneObject.context;\r\n        var waterNormalsPath = getStrFromEnv(\"${SD}/images/waterNormals.jpg\");\r\n        var specularMap = getStrFromEnv(\"${SD}/images/earthspec.png\");\r\n        \r\n\r\n        var p = viewer.scene.primitives.add(\r\n            new Cesium.Primitive({\r\n                geometryInstances: new Cesium.GeometryInstance({\r\n                    geometry: new Cesium.RectangleGeometry({\r\n                        rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),\r\n                        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,\r\n                        height: 0,\r\n                        extrudedHeight: 10\r\n                    }),\r\n                }),\r\n                appearance: new Cesium.EllipsoidSurfaceAppearance({\r\n                    material: new Cesium.Material({\r\n                    fabric: {\r\n                        type: \"Water\",\r\n                        uniforms: {\r\n                        specularMap: specularMap,\r\n                        //normalMap: Cesium.buildModuleUrl(\"Assets/Textures/waterNormals.jpg\"),\r\n                        normalMap: waterNormalsPath,\r\n                        frequency: 10000.0,\r\n                        animationSpeed: 0.01,\r\n                        amplitude: 1.0,\r\n                        },\r\n                    },\r\n                    }),\r\n                    aboveGround: true\r\n                }),\r\n                show: true,\r\n            })\r\n        );\r\n        return p;\r\n    }\r\n    \r\n    // 销毁primitive\r\n    function destroyPrimitive(viewer, p) {\r\n        viewer.scene.primitives.remove(p)\r\n    }\r\n\r\n    class CzmViewerAttachedObj extends XE2['xe2-base-utils'].Destroyable {\r\n        constructor(czmViewer) {\r\n            super();\r\n\r\n            const { viewer } = czmViewer;\r\n            if (!viewer) return;\r\n            const p = createPrimitive(viewer);\r\n            this.dispose(() => destroyPrimitive(viewer, p));\r\n        }\r\n    }\r\n\r\n    class AppendedObj extends XE2['xe2-base-utils'].Destroyable {\r\n        constructor() {\r\n            super();\r\n            this.disposeVar(sceneObject.createAttachedObject(viewer => {\r\n                if (!(viewer instanceof XE2['xe2-cesium-objects'].CzmViewer)) return undefined;\r\n                return new CzmViewerAttachedObj(viewer);\r\n            }));\r\n        }\r\n    }\r\n    return new AppendedObj();\r\n}"
        };
        app.creatorUi.items = [...app.creatorUi.items, {
            name: "官网资源(网络)",
            children: [
                {
                    name: '海水特效',
                    content: {
                        type: "sceneObjJson",
                        sceneObjJson: 海水json,
                    }
                }
            ],
        }]
    }

    const infoFunc = app => {
        const creatButtonFunc = () => {            
            const 通知按钮 = app.xe2ProjectManager.createSceneObjectFromJson({
                "type": "RectangleButton",
                "name": "通知按钮",
                "width": 0,
                "height": 32,
                "borderWidth": 0,
                "backgroundColor": [0, 0, 0, 0],
                "cssText": "cursor: pointer;\nline-height: 32px;\npadding: 0 4px;",
                "clickFuncStr": "\nfunction(mouseEvent) {\n    window.open('https://www.wolai.com/vtxf/efJLbZyoKjGwCWqh9Ck6v7');\n}\n",
                "statusFuncStr": "function (status, sceneObject) {\n    const ratioMap = {\n        normal: 0.1,\n        hovered: 0.3,\n        pressed: 0.35,\n    };\n    const r = ratioMap[status];\n\n    sceneObject.backgroundColor = [r, r, r, 0];\n    sceneObject.textColor = [0.9+r, 0.9+r, 0.9+r, 1];\n}\n",
                "text": "感谢您使用m3t!",
                "fontSize": 12,
                "textLayoutType": "None",
                "containerId": "m3t_info_div",
            });
            app.dispose(() => app.xe2ProjectManager.destroySceneObject(通知按钮));
        }

        if ('complete' === document.readyState) {
            creatButtonFunc();
        } else {
            document.addEventListener('DOMContentLoaded', creatButtonFunc);
        }
    }

    const m3tAppCreatedFunc = app => {
        infoFunc(app);
        creatorUiFunc(app);
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

