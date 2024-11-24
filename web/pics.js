
const imageButtonTemplateJson = {
    "type": "RectangleButton",
    "name": "ImageButton",
    "width": 128,
    "height": 128,
    "backgroundColor": null,
    "borderColor": [ 0.8, 0.8, 0.8, 0.8 ],
    "clickFuncStr": "\nfunction(mouseEvent) {\n    alert(\"https://czmtoy.com/p/my3dtiles/assets/images/my3dtiles_s.png\");\n}\n",
    "statusFuncStr": "function (status, sceneObject) {\n    const ratioMap = {\n        normal: 0.8,\n        hovered: 0.9,\n        pressed: 1,\n    };\n    const r = ratioMap[status];\n\n    sceneObject.borderColor = [1*r, 1*r, 1*r, 1*r];\n    //sceneObject.backgroundColor = [.1*r, .1*r, .1*r, .9*r];\n    //sceneObject.textColor = [1*r, 1*r, 1*r, 1*r];\n}\n",
    "normalImageUri": "https://czmtoy.com/p/my3dtiles/assets/images/my3dtiles_s.png"
}

function getItems(node, sceneObjects) {
    for (const child of node.children) {
        const { content } = child;
        if (content) {
            if (content.type === 'm3tJsonUri') {
                const buttonJson = { ...imageButtonTemplateJson };
                buttonJson.normalImageUri = child.previewImageUri;
                
                

                buttonJson.clickFunc = () => {
                    
                };

            }
        }
    }
}

