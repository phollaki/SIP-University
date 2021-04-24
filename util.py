from postgre import Session
from course import Course
from bottle import response
import jsonpickle


def generate_course_id():
    max_id = 1
    with Session() as session:
     max_id = max([int(instance.crs_code.rstrip("0")) for instance in session.query(Course).filter(Course.crs_code != 'fake')])+2
    return  "000" + str(max_id) if max_id < 10 else "00" + str(max_id) if (max_id >= 10 and max_id < 100) else "0" + str(max_id) if (max_id >= 100 and max_id < 1000) else str(max_id)
   


def response_wrapper(status_code, body):
    response.status = status_code; 
    response.body = jsonpickle.encode(body)
    return response

