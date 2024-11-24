function getTreePath(sceneTreeItem) {
    // 修改网页地址
    const names = [];
    let currentItem = lastSelectedItem;
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


