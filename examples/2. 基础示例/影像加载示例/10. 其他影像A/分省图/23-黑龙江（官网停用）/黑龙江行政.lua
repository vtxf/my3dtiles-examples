function getTileUrl (zoom,x,y)
	return "http://www.maphlj.com/hljdlg11_hh_qqhr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=hljdlg11_hh_qqhr&STYLE=hljdlg11_hh_qqhr&TILEMATRIXSET=Matrix_0&TILEMATRIX=" .. zoom .. "&TileRow=" .. y .. "&TileCol=" .. x .. "&FORMAT=image%2Fpng"
end