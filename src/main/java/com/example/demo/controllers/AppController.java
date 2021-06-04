package com.example.demo.controllers;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.http.HTTPBinding;

import org.hibernate.annotations.NotFound;
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
	private ResponseEntity<Student_Dim> saveOrUpdate(@RequestHeader(value="authorization", required = false) String Authorization, @RequestBody Student_Dim student) 
	{   
		if(Authorization == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(student);
		}
		else {
			token = Authorization;
			sendRequestForAuthServer(token);
			System.out.println(token);
			studentService.saveOrUpdate(student); 
			return ResponseEntity.status(HttpStatus.OK).body(student); 
		}
	}
	
	@GetMapping("https://sipauth.webszolgaltatas.hu/auth/current")
	private void sendRequestForAuthServer(String token) {
	}
	
	
	//Edit a student_information
	@PutMapping("/students/{id}")
	public ResponseEntity<Student_Dim> update(@RequestHeader(value="authorization", required = false) String Authorization, @RequestBody Student_Dim student) {
		if(Authorization == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(student);
		}
		else {
			token = Authorization;
			sendRequestForAuthServer(token);
			System.out.println(token);
			studentService.update(student); 
			return ResponseEntity.status(HttpStatus.OK).body(student); 
		}
	}
	@DeleteMapping("/students/{id}")
	private ResponseEntity<String> delete(@RequestHeader(value="authorization", required = false) String Authorization, @RequestBody Student_Dim student){
		if(Authorization == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
		}
		else {
			token = Authorization;
			sendRequestForAuthServer(token);
			System.out.println(token);
			studentService.delete(student.getStu_id()); 
			return ResponseEntity.status(HttpStatus.OK).body("Student has been deleted"); 
		}
	}
}
