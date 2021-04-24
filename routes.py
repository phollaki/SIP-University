from bottle import request, post, delete, put, response, get, error
import jsonpickle
from coursemanager import manager
from datetime import datetime
from course import Course
from sqlalchemy import exc
from api_exceptions import NotFoundException
from util import response_wrapper
from dotenv import dotenv_values

config = dotenv_values(".env")



props =  {'CRS_TITLE', 'FAC_CODE', 'INS_ID', 'DEP_CODE'}


## API routes
@get('/courses')
def courses(user_details):
    """Get all courses"""
    try:
        return response_wrapper(200, dict(message = "The query of all courses went succesful.", result = jsonpickle.decode(manager.getAll())))
        
    except Exception as err:
        return response_wrapper(500, dict(error = err.args[0]) )


@get('/courses/:id')
def course(user_details, id):
    
    """Get a single course based on it's ID"""
    if id is None:
     return response_wrapper(400, dict(error = "You must specify an id for the given route!") )
    try:
        return response_wrapper(200, dict(message = "The query of a single course went succesful.", result = manager.getOne(id)))

    except NotFoundException as err:
        return response_wrapper(404, dict(error = str(err)))
    except Exception as err:
        return response_wrapper(500, dict(error = err.args[0]))



@post('/courses')
def create_course(user_details):
        if(user_details["isAdmin"] == False):
         return response_wrapper(401, dict(error = "You are not authorized to create a new course."))
        """Create a single course based on a body parameter"""
        if(request.body):
            try:
                decoded_body = jsonpickle.decode(request.body.read())
                if all(k in decoded_body for k in props):
                 try:
                  return response_wrapper(201, dict(message = "You have succesfully created a course.", result = manager.createOne(decoded_body)))          
                 except Exception as err:
                  return response_wrapper(500, dict(error = err.args[0]))

                else:
                 return response_wrapper(422, dict(error = "The given json property doesn't contain all the neccesary properties."))

            except:
                return response_wrapper(422, dict(error = "The given course data is not a valid json obj."))
            else:
                return response_wrapper(400, dict(error = "You must provide a request body to this method."))


"""Update a Course by it's ID """
@put('/courses/:id')
def update_course(user_details, id=None):
    if(user_details["isAdmin"] == False):
         return response_wrapper(401, dict(error = "You are not authorized to edit a course."))


    if id is None:
     return response_wrapper(400, dict(error = "You must specify an ID for the given route."))
    
     
    try:
                decoded_body = jsonpickle.decode(request.body.read())
                if all(k in decoded_body for k in props):
                 
                    try:
                        return response_wrapper(200, dict(message = "The update of a single course went succesful.", result = manager.updateOne(id, decoded_body)))          
                 
                    except NotFoundException as err:
                        return response_wrapper(404, dict(error = str(err)))
                    except Exception as err:
                        return response_wrapper(500, dict(error = err.args[0]))

                else:
                 return response_wrapper(400, dict(error = "The given json property doesn't contain all the neccesary properties."))

    except Exception as err:
        return response_wrapper(500, dict(error = err.args[0]))

            


"""Delete a Course by it's ID """
@delete('/courses/:id')
def delete_course(user_details, id=None):
     

     if(user_details["isAdmin"] == False):
         return response_wrapper(401, dict(error = "You are not authorized to delete this course."))
     
     if id is None:
      return response_wrapper(400, dict(error = "You must specify an ID for the given route."))
     try:
         return response_wrapper(200, dict(message = "You have succesfully deleted the course.", result = manager.deleteOne(id)))
     except NotFoundException as err:
         return response_wrapper(404, dict(error = str(err)))
     except Exception as err:
         return response_wrapper(500, dict(error = err.args[0]) )



@error(404)
def error404(error):
    return response_wrapper(404, dict(error = "No resource on the given route.") )


@error(500)
def error500(error):
    return response_wrapper(500, dict(error = "There was a problem on the server... {err}".format(err=error)) )

@error(405)
def error405(error):
    return response_wrapper(500, dict(error = "The given method is not allowed for this route!") )






       