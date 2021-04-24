import bottle
import os
import sys
import routes
from decorators import CheckJwt, SetHeaders

if '--debug' in sys.argv[1:] or 'SERVER_DEBUG' in os.environ:
    bottle.debug(True)





app = application = bottle.default_app()
app.install(CheckJwt())
app.install(SetHeaders())






def wsgi_app():
    return app

if __name__ == '__main__':
    PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
    HOST = os.environ.get('SERVER_HOST', '0.0.0.0')
    try:
        PORT = 13224
    except ValueError:
        PORT = 13225




    # Starts a local test server.
    bottle.run(server='wsgiref', host=HOST, port=13224)
