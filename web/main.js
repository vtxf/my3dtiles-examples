function getTreePath(sceneTreeItem) {
    // 修改网页地址
    const names = [];
    let currentItem = sceneTreeItem;
    while (currentItem && currentItem.name !== 'root') {
        names.push(currentItem.name);
        currentItem = currentItem.parent;
    }
    console.log(names)
    names.reverse();
    const treePath = names.join('/');
    return treePath;
}

function replaceUrl(treePath) {
    treePath = encodeURIComponent(treePath);
    history.replaceState({}, "", `?src=${treePath}`);
}

function getM3tJsonUri(treeItem) {
    let uri = '';
    do {
        const { extras } = treeItem;
        if (!extras) break;

        const { content } = extras;
        if (!content) break;

        const c = content;
        if (c.type === 'm3tJson') {
            // jsonContent = c.m3tJson;
        } else if (c.type === 'm3tJsonUri') {
            // jsonContent = await cancelsManager.promise(fetchJson(c.m3tJsonUri));
            uri = c.m3tJsonUri;
        } else if (c.type === 'm3toJson') {
            // jsonContent = c.m3toJson;
        } else if (c.type === 'm3toJsonUri') {
            // jsonContent = await cancelsManager.promise(fetchJson(c.m3toJsonUri));
        } else if (c.type === 'sceneObjJson') {
            // jsonContent = c.sceneObjJson;
        } else if (c.type === 'sceneObjJsonUri') {
            // jsonContent = await cancelsManager.promise(fetchJson(c.sceneObjJsonUri));
        } else {
            // jsonContent = {};
            // iframeSrc = baseHref;
        }
    } while (false);

    return uri;
}

function getBaseHref() {
    const href = new URL('../', window.location.href).href;
    const baseHref = `${href}app/versions/last/`;
    return baseHref;
}


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

async function getJsonContentFromTreeItem(treeItem) {
    let jsonContent = {};
    do {
        const { extras } = treeItem;
        if (!extras) break;

        const { content } = extras;
        if (!content) break;

        const c = content;
        if (c.type === 'm3tJson') {
            jsonContent = c.m3tJson;
        } else if (c.type === 'm3tJsonUri') {
            jsonContent = await (fetchJson(c.m3tJsonUri));
        } else if (c.type === 'm3toJson') {
            jsonContent = c.m3toJson;
        } else if (c.type === 'm3toJsonUri') {
            jsonContent = await (fetchJson(c.m3toJsonUri));
        } else if (c.type === 'sceneObjJson') {
            jsonContent = c.sceneObjJson;
        } else if (c.type === 'sceneObjJsonUri') {
            jsonContent = await (fetchJson(c.sceneObjJsonUri));
        } else {
            jsonContent = {};
        }
    } while (false);
    return jsonContent;
}

async function getM3tListJsonRoot() {
    // 加载脚本所在目录下面的m3t_list.json文件
    const m3tListJsonResponse = await fetch("../m3t_list.json");
    if (!m3tListJsonResponse.ok) {
        console.warn("无法加载m3t_list.json文件！");
        return;
    }

    const m3tListJson = await m3tListJsonResponse.json();
    // console.log("m3t_list.json内容:", m3tListJson);
    /** @type MyTreeItemJsonType */
    const root = m3tListJson.list.root;

    const href = new URL('../', window.location.href).href;
    convertPathForItems(root, href);

    return root;
}

async function getTreeItemFromTreePath(treePath) {
    // 解码src参数
    const decodedSrc = decodeURIComponent(treePath);
    // 用/分割路径
    const pathSegments = decodedSrc.split('/');

    // console.log('解码后的路径:', decodedSrc);
    // console.log('路径片段:', pathSegments);

    const { ContentLeftTree } = XE2.g.refs;
    if (!ContentLeftTree) return;
    const { mySceneTreeUi } = ContentLeftTree;
    if (!mySceneTreeUi) return;
    const { sceneTree } = mySceneTreeUi;
    if (!sceneTree) return;
    const { root } = sceneTree;
    if (!root) return;

    // 获取子节点
    var currentItem = root;

    function getChild(item, func) {
        for (let e of item.children) {
            if (func(e)) return e;
        }
        return undefined;
    }

    pathSegments.reverse();

    while (currentItem && (pathSegments.length > 0)) {
        const childName = pathSegments.pop();
        currentItem = getChild(currentItem, e => e.name === childName);
    }

    return currentItem;
}

function getTreeItemAllPreviewImages(treeItem, previewImageUriAndTreeItems) {
    if (treeItem.extras.previewImageUri) {
        previewImageUriAndTreeItems.push({ previewImageUri: treeItem.extras.previewImageUri, treeItem });
    }
    if (treeItem.children && treeItem.children.length > 0) {
        for (const child of treeItem.children) {
            getTreeItemAllPreviewImages(child, previewImageUriAndTreeItems);
        }
    }
}