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

const creatorUiFunc = async () => {
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

    /** @type {MyTreeItemJsonType[]} */
    // const items = [...app.creatorUi.items, root];
    // app.creatorUi.items = items;
    const { ContentLeftTree } = XE2.g.refs;
    ContentLeftTree.items = [root];
}

