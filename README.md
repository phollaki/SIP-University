#  Courses Api 
A CRUD REST API implementation of courses via the Python Bottle framework.

LIVE URL: https://sipcourses.webszolgaltatas.hu


## Endpoints

| METHOD 	| ENDPOINT     	| DESCRIPTION                                 	| Example success result                                                                                                                                                                  	| Example error result                       	| Body parameters                    	|
|--------	|--------------	|---------------------------------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|--------------------------------------------	|------------------------------------	|
| GET    	| /courses     	| Returns all of the courses in a json array. 	| `{ "message": "The query of all courses went succesful.", "result": [{ "CRS_CODE": "fake", "CRS_TITLE": "No prerequisite", "FAC_CODE": "Fac_6", "INS_ID": null, "DEP_CODE": null }] }`    	| `{ "error": "Unathorized access."}`          	| -                                  	|
| GET    	| /courses/:id 	| Returns a single course.                    	| `{ "message": "The query of a single course went succesful.", "result": { "CRS_CODE": "fake", "CRS_TITLE": "No prerequisite", "FAC_CODE": "Fac_6", "INS_ID": null, "DEP_CODE": null } }`  	| `{ "error": "The course cannot be found." }` 	| -                                  	|
| POST   	| /courses     	| Creates a single course and returns it.     	| `{ "message": "You have succesfully created a course.", "result": { "CRS_CODE": "0153", "CRS_TITLE": "No prerequisite", "FAC_CODE": "Fac_6", "INS_ID": null, "DEP_CODE": null } }`        	| `{ "error": "Unathorized access."}`          	| CRS_TITLE,FAC_CODE,INS_ID,DEP_CODE 	|
| UPDATE 	| /courses/:id 	| Updates a single course and returns it.     	| `{ "message": "The update of a single course went succesful.", "result": { "CRS_CODE": "0157", "CRS_TITLE": "No prerequisite", "FAC_CODE": "Fac_6", "INS_ID": null, "DEP_CODE": null } }` 	| `{ "error": "Unathorized access. "}`         	| CRS_TITLE,FAC_CODE,INS_ID,DEP_CODE 	|
| DELETE 	| /courses/:id 	| Deletes a single course and returns it.     	| `{ "message": "You have succesfully deleted the course.", "result": { "CRS_CODE": "0157", "CRS_TITLE": "No prerequisite", "FAC_CODE": "Fac_6", "INS_ID": null, "DEP_CODE": null } }`      	| `{ "error": "Unathorized access."}`          	|                                    	|
