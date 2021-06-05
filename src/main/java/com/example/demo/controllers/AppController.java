package com.example.demo.controllers;


import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.http.HTTPBinding;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.hibernate.annotations.NotFound;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpClientErrorException.Unauthorized;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.entities.Student_Dim;
import com.example.demo.exceptions.StudentNotFoundException;
import com.example.demo.exceptions.UnauthorizedClient;
import com.example.demo.repositories.StudentRepository;
import com.example.demo.services.StudentService;

import javassist.NotFoundException;

@RestController
public class AppController {
	String token;
	
	@Autowired
	private StudentService studentService;
	
	//HANDLER METHODS
	
	//Display all students data
	@GetMapping("/students")
	public List<Student_Dim> viewStudentPage() {
		return studentService.getAllStudents();
	}
	//Display 1 student's data
	@GetMapping("/students/id/{stu_id}")  
	private ResponseEntity<Student_Dim> getStudentById(@PathVariable("stu_id") String stu_id){
		Student_Dim student = studentService.getStudentById(stu_id);
		return ResponseEntity.status(HttpStatus.OK).body(student);
	} 
	@GetMapping("/students/department/{dep_code}")  
	private ResponseEntity<List<Student_Dim>> getStudentByDepartment(@PathVariable("dep_code") String dep_code){
		List<Student_Dim> student = studentService.getStudentByDep(dep_code);
		return ResponseEntity.status(HttpStatus.OK).body(student);
	} 
	@GetMapping("/students/faculty/{fac_code}")  
	private ResponseEntity<List<Student_Dim>> getStudentByFaculty(@PathVariable("fac_code") String fac_code){
		List<Student_Dim> student = studentService.getStudentByFac(fac_code);
		return ResponseEntity.status(HttpStatus.OK).body(student);
	} 
	@GetMapping("/students/location/{loc_code}")  
	private ResponseEntity<List<Student_Dim>> getStudentByLocation(@PathVariable("loc_code") String loc_code){
		List<Student_Dim> student = studentService.getStudentByLoc(loc_code);
		return ResponseEntity.status(HttpStatus.OK).body(student);
	} 
	@GetMapping("/students/fname/{stu_fname}")  
	private ResponseEntity<List<Student_Dim>> getStudentByFirstName(@PathVariable("stu_fname") String stu_fname){
		List<Student_Dim> student = studentService.getStudentByFname(stu_fname);
		return ResponseEntity.status(HttpStatus.OK).body(student);
	} 
	@GetMapping("/students/lname/{lname}")  
	private ResponseEntity<List<Student_Dim>> getStudentByLastName(@PathVariable("lname") String stu_lname){
		List<Student_Dim> student = studentService.getStudentBylname(stu_lname);
		return ResponseEntity.status(HttpStatus.OK).body(student);
	} 
	@GetMapping("/students/marriagestatus/{marriagestatus}")  
	private ResponseEntity<List<Student_Dim>> getStudentByMarriageStatus(@PathVariable("marriagestatus") String marriagestatus){
		List<Student_Dim> student = studentService.getStudentByMarriageStatus(marriagestatus);
		return ResponseEntity.status(HttpStatus.OK).body(student);
	} 
	@GetMapping("/students/address/{address}")  
	private ResponseEntity<List<Student_Dim>> getStudentByAddress(@PathVariable("address") String address){
		List<Student_Dim> student = studentService.getStudentByAddress(address);
		return ResponseEntity.status(HttpStatus.OK).body(student);
	} 
	
	//Create a student_dim (student)
	@PostMapping("/students")  
	private ResponseEntity<Student_Dim> saveOrUpdate(@RequestHeader(value="authorization", required = false) String AuthToken, @RequestBody Student_Dim student) throws ClientProtocolException, IOException, JSONException 
	{   
		CloseableHttpClient client = HttpClients.createDefault();
	    HttpGet httpPost = new HttpGet("https://sipauth.webszolgaltatas.hu/auth/current");
	    httpPost.setHeader("Accept", "application/json");
	    httpPost.setHeader("Content-type", "application/json");
	    String authHeader = AuthToken;
	    httpPost.setHeader(HttpHeaders.AUTHORIZATION, authHeader);
	    CloseableHttpResponse response = client.execute(httpPost);
	    
	    JSONObject json = wrapResponse(response);
	    System.out.println(json);
	    
	    if(json.has("isAdmin") && json.getString("isAdmin")=="false") {
	    	client.close();
	    	return new ResponseEntity<Student_Dim>(HttpStatus.FORBIDDEN);
	    }
	    else if(json.has("isAdmin") && json.getString("isAdmin")=="true") {
	    	studentService.saveOrUpdate(student);
	    	return new ResponseEntity<Student_Dim>(student, HttpStatus.OK);
	    }
	    else if(json.has("error")) {
		    client.close();
	    	return new ResponseEntity<Student_Dim>(HttpStatus.UNAUTHORIZED);
	    }
	    else return new ResponseEntity<Student_Dim>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
	//Edit a student_information
	@PutMapping("/students/{id}")
	public ResponseEntity<Student_Dim> update(
			@RequestHeader(value="authorization", required = false) String AuthToken, 
			@RequestBody Student_Dim student) throws ClientProtocolException, IOException, UnsupportedOperationException, JSONException {
		CloseableHttpClient client = HttpClients.createDefault();
	    HttpGet httpPost = new HttpGet("https://sipauth.webszolgaltatas.hu/auth/current");
	    httpPost.setHeader("Accept", "application/json");
	    httpPost.setHeader("Content-type", "application/json");
	    String authHeader = AuthToken;
	    httpPost.setHeader(HttpHeaders.AUTHORIZATION, authHeader);
	    CloseableHttpResponse response = client.execute(httpPost);
	    
	    JSONObject json = wrapResponse(response);
	    System.out.println(json);
	    
	    if(json.has("isAdmin") && json.getString("isAdmin")=="false") {
	    	client.close();
	    	return new ResponseEntity<Student_Dim>(HttpStatus.FORBIDDEN);
	    }
	    else if(json.has("isAdmin") && json.getString("isAdmin")=="true") {
	    	studentService.update(student);
	    	return new ResponseEntity<Student_Dim>(student, HttpStatus.OK);
	    }
	    else if(json.has("error")) {
		    client.close();
	    	return new ResponseEntity<Student_Dim>(HttpStatus.UNAUTHORIZED);
	    }
	    else return new ResponseEntity<Student_Dim>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
	@DeleteMapping("/students/{id}")
	private ResponseEntity<String> delete(@RequestHeader(value="authorization", required = false) String AuthToken, 
			@RequestBody Student_Dim student) throws ClientProtocolException, IOException, UnsupportedOperationException, JSONException{
		CloseableHttpClient client = HttpClients.createDefault();
	    HttpGet httpPost = new HttpGet("https://sipauth.webszolgaltatas.hu/auth/current");
	    httpPost.setHeader("Accept", "application/json");
	    httpPost.setHeader("Content-type", "application/json");
	    String authHeader = AuthToken;
	    httpPost.setHeader(HttpHeaders.AUTHORIZATION, authHeader);
	    CloseableHttpResponse response = client.execute(httpPost);
	    
	    JSONObject json = wrapResponse(response);
	    System.out.println(json);
	    
	    if(json.has("isAdmin") && json.getString("isAdmin")=="false") {
	    	client.close();
	    	return new ResponseEntity<String>(HttpStatus.FORBIDDEN);
	    }
	    else if(json.has("isAdmin") && json.getString("isAdmin")=="true") {
	    	studentService.delete(student.getStu_id());
	    	return new ResponseEntity<String>(HttpStatus.OK);
	    }
	    else if(json.has("error")) {
		    client.close();
	    	return new ResponseEntity<String>(HttpStatus.UNAUTHORIZED);
	    }
	    else return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	private JSONObject wrapResponse(CloseableHttpResponse response) throws UnsupportedOperationException, IOException, JSONException {
		int statusCode = response.getStatusLine().getStatusCode();
	    //assertThat(statusCode, equalTo(200));
	    
	    String res = null;
	    HttpEntity entity = response.getEntity();
	    if (entity != null) {
	      InputStream instream = entity.getContent();
	      byte[] bytes = IOUtils.toByteArray(instream);
	      res = new String(bytes, "UTF-8");
	      instream.close();
	    }
	    JSONObject json = new JSONObject(res);
	    return json;
	}
}
