import requests
from bottle import request, response, HTTPResponse
from dotenv import dotenv_values
import jsonpickle
from util import response_wrapper

config = dotenv_values(".env")

sec_headers = {  'Access-Control-Allow-Origin': '*',
               'Access-Control-Allow-Methods' : '*',
               'Content-Type' : 'application/json',
               'Access-Control-Allow-Headers' : '*'
               }
user_details = None;

class CheckJwt(object):
    name = 'check_jwt'
    api = 2

    def apply(self, fn, context):
        def _check_jwt(*args, **kwargs):
             try:
              auth_header = {"Authorization" : request.headers["Authorization"]}
             except:
              return HTTPResponse(status=500, body=dict(error = "There was no auth header on the incoming request."), headers = sec_headers)
              

             r = requests.get('{auth_endpoint}/auth/current'.format(auth_endpoint = config["AUTH_ENDPOINT"]), headers = auth_header );
             if(r.status_code != 200):
                
                return HTTPResponse(status=401, body=dict(r.json()), headers = sec_headers)
                
             user_details = jsonpickle.decode(r.content);

             return fn(user_details, *args, **kwargs)

        return _check_jwt




class SetHeaders(object):
    name = 'set_headers'
    api = 2

    def apply(self, fn, context):
        def _set_headers(*args, **kwargs):
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = '*'
            response.headers['Access-Control-Allow-Headers'] = '*'
            response.headers['Content-Type'] = 'application/json'

            if request.method != 'OPTIONS':
            
                return fn(*args, **kwargs)

        return _set_headers
    