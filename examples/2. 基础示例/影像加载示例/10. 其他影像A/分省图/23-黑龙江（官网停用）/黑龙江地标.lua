function getTileUrl (zoom,x,y)
	return "http://www.maphlj.com/hljdlgbz11_hh_qqhr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=hljdlgbz11&STYLE=hljdlgbz11&TILEMATRIXSET=Matrix_0&TILEMATRIX=" .. zoom .. "&TileRow=" .. y .. "&TileCol=" .. x .. "&FORMAT=image%2Fpng"
end