import os
import cherrypy

PATH = os.path.abspath(os.path.dirname(__file__))



class Root(object): pass
		


config={
	'/': {
					'tools.staticdir.on': True,
					'tools.staticdir.dir': PATH,
					'tools.staticdir.index': 'index.html',
			},
}

cherrypy.server.socket_host = 'localhost'
cherrypy.quickstart(Root(),'/',config)
