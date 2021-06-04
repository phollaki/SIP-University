# Student API works as a client. Get requests from server like list students, get student with given id, list students with given department code, faculty code, location code, first name and last name. 

ENDPOINTS:

| METHOD 	| ENDPOINT     	| DESCRIPTION                                 	| Example success result                                                                                                                                                                  	| Example error result                       	| Body parameters                    	|
|--------	|--------------	|---------------------------------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|--------------------------------------------	|------------------------------------	|
| GET    	| /students     	| Returns all of the students in a json array. 	| `{ "message": "OK.", "result": [{"stu_id": "stud5","stu_fname": "Németh","stu_lname": "Ákos","dep_code": "d1","fac_code": "Fac_6","loc_code": "loc1","marriage_status": "divorced","address": null},{"stu_id": "stud323","stu_fname": "Puteáni-Holl","stu_lname": "Júlia","dep_code": "d1","fac_code": "Fac_6","loc_code": "loc1","marriage_status": null,"address": null},] }`    	| -          	| -                                  	|
| GET    	| /students/id/{id} 	| Returns a single student.                    	| `{ "message": "OK.", "result": { {"stu_id": "stud5","stu_fname": "Németh","stu_lname": "Ákos","dep_code": "d1","fac_code": "Fac_6","loc_code": "loc1","marriage_status": "divorced","address": null}`  	| `{"error": "Not Found","message": "No student with given Id"}` 	| -                                  	|
| GET   	| /students/department/{dep_code}     	| Return students with given department code.     	| `{ "message": "OK.", "result:"{{"stu_id":"stud5","stu_fname":"Németh","stu_lname":"Ákos","dep_code":"d1","fac_code":"Fac_6","loc_code":"loc1","marriage_status":"divorced","address":null},..}`        	|  `{"error": "Not Found","message": "No student with given Department"}` | -	|
| GET   	| /students/faculty/{fac_code}     	| Return students with given faculty code.     	| `{ "message": "OK.", "result:"{{"stu_id":"stud5","stu_fname":"Németh","stu_lname":"Ákos","dep_code":"d1","fac_code":"Fac_6","loc_code":"loc1","marriage_status":"divorced","address":null},..}`        	|  `{"error": "Not Found","message": "No student with given Faculty"}` | -	|
| GET   	| /students/location/{loc_code}     	| Return students with given location code.     	| `{ "message": "OK.", "result:"{{"stu_id":"stud5","stu_fname":"Németh","stu_lname":"Ákos","dep_code":"d1","fac_code":"Fac_6","loc_code":"loc1","marriage_status":"divorced","address":null},..}`        	|  `{"error": "Not Found","message": "No student with given Location"}` | -	|
| GET   	| /students/fname/{stu_fname}     	| Return students with given first name.     	| `{ "message": "OK.", "result:"{{"stu_id":"stud5","stu_fname":"Németh","stu_lname":"Ákos","dep_code":"d1","fac_code":"Fac_6","loc_code":"loc1","marriage_status":"divorced","address":null},..}`        	|  `{"error": "Not Found","message": "No student with given First name"}` | -	|
| GET   	| /students/lname/{stu_lname}     	| Return students with given Last name.     	| `{ "message": "OK.", "result:"{{"stu_id":"stud5","stu_fname":"Németh","stu_lname":"Ákos","dep_code":"d1","fac_code":"Fac_6","loc_code":"loc1","marriage_status":"divorced","address":null},..}`        	|  `{"error": "Not Found","message": "No student with given Last name"}` | -	|
| POST   	| /students     	| Creates a single student and returns it.     	| `{ "message": "OK", "result": {"stu_id":"stud5","stu_fname":"Németh","stu_lname":"Ákos","dep_code":"d1","fac_code":"Fac_6","loc_code":"loc1","marriage_status":"divorced","address":null}`        	| `{ "error": "Unathorized."}`          	| STU_ID, STU_FNAME, STU_LNAME, DEP_CODE,FAC_CODE,LOC_CODE,MARRIAGE_STATUS,ADDRESS 	|
| UPDATE 	| /students/{id} 	| Updates a single student and returns it.     	| `{ "message": "OK", "result": {"stu_id":"stud5","stu_fname":"Németh","stu_lname":"Ákos","dep_code":"d1","fac_code":"Fac_6","loc_code":"loc1","marriage_status":"divorced","address":null}` 	| `{ "error": "Unathorized. "}`         	|  STU_ID, STU_FNAME, STU_LNAME, DEP_CODE,FAC_CODE,LOC_CODE,MARRIAGE_STATUS,ADDRESS 	|
| DELETE 	| /students/{id} 	| Deletes a single student and returns it.     	| `{ "message": "OK.", "result": {"stu_id":"stud5","stu_fname":"Németh","stu_lname":"Ákos","dep_code":"d1","fac_code":"Fac_6","loc_code":"loc1","marriage_status":"divorced","address":null}`}`      	| `{ "error": "Unathorized."}`          	|                                    	|
