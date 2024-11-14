///////////////////////////////////////////////////////////////
// 1. 创建My3dtilesApp
const app = new My3dtilesApp();
window.g_app = app;

///////////////////////////////////////////////////////////////
// 2. 加载默认场景
// 浏览器是否有参数 
const search = !!window.location.search.substring(1);
// 没有的话，就做一下操作
if (!search) {
    // 加载默认场景 default.m3tjson
    g_app.loadDataFromUrlOrFilePath(new URL('./scene/default.m3tjson', window.location).toString());
}

///////////////////////////////////////////////////////////////
// 3. 这里还可以写别的自定义的代码
// ...