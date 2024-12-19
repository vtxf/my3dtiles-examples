function getTileUrl (zoom,x,y)
	return "http://www.maphlj.com/hljdombz9_hh_qqhr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=hljdombz9_hh_qqhr&STYLE=hljdombz9_hh_qqhr&TILEMATRIXSET=Matrix_0&TILEMATRIX=" .. zoom .. "&TileRow=" .. y .. "&TileCol=" .. x .. "&FORMAT=image%2Fpng"
end