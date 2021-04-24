#  Auth Api 
Basically a small microservice which handles the authentication/authorization logic among all the projects. 

### Logic
Any module should extract the incoming request's `Authorization` header and make a request towards this service to the `/auth/current` route including that header. This service gives back whether the user is authenticated, and additionally the id and the role of the user.

In order to generate a valid jwt value for this Bearer method, you have to login first via the `/auth/login` route.

LIVE URL: https://sipauth.webszolgaltatas.hu


## Endpoints

| METHOD 	| ENDPOINT      	| DESCRIPTION                                                                                  	| Example success result                                         	| Example error result             	| Body parameters    	|
|--------	|---------------	|----------------------------------------------------------------------------------------------	|----------------------------------------------------------------	|----------------------------------	|--------------------	|
| POST   	| /auth/login   	| Logs in the user (student or admin) with the specified username and password.                	| `{"message": "Success.", "token": "01234567"}`                   	| `{ "error": "Invalid password!" }` 	| username, password 	|
| GET    	| /auth/current 	| Returns the currently logged in user's id, a field indicating whether he is an admin or not. 	| `{"message": "Success.", "isAdmin": true, "userId": "admin_01"}` 	| `{"error": "Unathorized access.}`  	| -                  	|
