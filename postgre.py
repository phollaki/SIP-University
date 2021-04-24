from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import dotenv_values

config = dotenv_values(".env")



hostEnv=config["HOST"]
portEnv=config["PORT"]
userEnv=config["USER"]
passwordEnv=config["PASSWORD"]
dbEnv=config["DB"]




sip_engine = engine = create_engine('postgresql://{user}:{password}@{host}:{port}/{db}'.format(
    host=hostEnv, port = portEnv, db = dbEnv, password = passwordEnv, user = userEnv))

course_map = declarative_base()
Session = sessionmaker(bind=sip_engine)





