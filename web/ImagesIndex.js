
const statusFuncStr = `\
function (status, sceneObject) {
    if (status === 'normal') {
        sceneObject.borderColor = [0, 0, 0, 1];
        sceneObject.borderWidth = .5;
    } else if (status === 'hovered') {
        sceneObject.borderColor = [.9, .9, .9, 1];
        sceneObject.borderWidth = 2;
    } else if (status === 'pressed') {
        sceneObject.borderColor = [1, 1, 1, 1];
        sceneObject.borderWidth = 2;
    }
}
`;

const cssText = `
cursor: pointer;
box-sizing: border-box;
`;

const imageButtonTemplateJson = {
    "type": "RectangleButton",
    "name": "ImageButton",
    "text": '',
    "width": 128,
    "height": 128,
    // "backgroundColor": null, // 会导致控制台报错
    "backgroundColor": [0, 0, 0, 0],
    "borderColor": [0, 0, 0, 1],
    "statusFuncStr": statusFuncStr,
    cssText,
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
                // tooltip: e.treePath,
                tooltip: e.name,
            });
            obj.clickFunc = () => { e.treeItem.selected = true; };
            return obj;
        });

        container.subIds = objs.map(e => e.id);
    }
}