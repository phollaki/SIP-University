from sqlalchemy import Column, Integer, String
from postgre import course_map

class Course(course_map):
    __tablename__ = 'course_dim'

    crs_code = Column(String(10), primary_key=True)
    crs_title = Column(String(30))
    fac_code = Column(String(9))
    ins_id = Column(String(9))
    dep_code = Column(String(4))


    def to_json(self):
        dict = {}
        dict["CRS_CODE"] = self.crs_code
        dict["CRS_TITLE"] = self.crs_title
        dict["FAC_CODE"] = self.fac_code
        dict["INS_ID"] = self.ins_id
        dict["DEP_CODE"] = self.dep_code
        return dict

