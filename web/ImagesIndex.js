
const imageButtonTemplateJson = {
    "type": "RectangleButton",
    "name": "ImageButton",
    "text": '',
    "width": 128,
    "height": 128,
    "backgroundColor": null,
    "borderColor": [ 0.8, 0.8, 0.8, 0.8 ],
    "statusFuncStr": "function (status, sceneObject) {\n    const ratioMap = {\n        normal: 0.8,\n        hovered: 0.9,\n        pressed: 1,\n    };\n    const r = ratioMap[status];\n\n    sceneObject.borderColor = [1*r, 1*r, 1*r, 1*r];\n    //sceneObject.backgroundColor = [.1*r, .1*r, .1*r, .9*r];\n    //sceneObject.textColor = [1*r, 1*r, 1*r, 1*r];\n}\n",
    "normalImageUri": "https://czmtoy.com/p/my3dtiles/assets/images/my3dtiles_s.png"
}

const { Destroyable } = XE2['xe2-base-utils'];

class ImagesIndex extends Destroyable {
    constructor(container, treeItem) {
        super();

        const previewImageUriAndTreeItems = [];
        getTreeItemAllPreviewImages(treeItem, previewImageUriAndTreeItems);

        const objs = previewImageUriAndTreeItems.map(e => {
            const obj = g_app.xe2ProjectManager.createSceneObjectFromJson({
                ...imageButtonTemplateJson,
                normalImageUri: e.previewImageUri,
                tooltip: e.name,
            });
            obj.clickFunc = () => { e.treeItem.selected = true; };
            return obj;
        });

        container.subIds = objs.map(e => e.id);
    }
}