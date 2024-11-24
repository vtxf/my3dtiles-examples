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