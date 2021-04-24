import jsonpickle
from util import generate_course_id
from postgre import Session
from course import Course
from api_exceptions import NotFoundException





class CourseManager:

    def getAll():
        with Session() as session:
            return jsonpickle.encode([instance.to_json() for instance in session.query(Course)])

    def getOne(crs_code):
        with Session() as session:
            res = session.query(Course).filter(Course.crs_code == crs_code).first()
            if res is None:
                raise NotFoundException(message = "The course cannot be found.")
            return res.to_json()
                

    def createOne(course_args):
        with Session() as session:
          
            created_course = Course(crs_code=generate_course_id(), crs_title=course_args["CRS_TITLE"], fac_code=course_args["FAC_CODE"], ins_id = course_args["INS_ID"], dep_code = course_args["DEP_CODE"]   )
            session.add(created_course)
            session.commit()
            res = session.query(Course).filter(Course.crs_code == created_course.crs_code).first()
            return res.to_json()



    def updateOne(crs_code, course_args):
           with Session() as session:
          
            res = session.query(Course).filter(Course.crs_code == crs_code).first()
            if res is None:
                raise NotFoundException(message = "The course cannot be found.")
            res.crs_title = course_args["CRS_TITLE"]
            res.fac_code = course_args["FAC_CODE"]
            res.dep_code = course_args["DEP_CODE"]
            res.ins_id = course_args["INS_ID"]
            session.commit()
            updated = session.query(Course).filter(Course.crs_code == crs_code).first()
            return updated.to_json()



    def deleteOne(crs_code):
           with Session() as session:
          
            res = session.query(Course).filter(Course.crs_code == crs_code).first()
            if res is None:
                raise NotFoundException(message = "The course cannot be found.")
            session.delete(res);
            session.commit()
            return res.to_json()



manager = CourseManager