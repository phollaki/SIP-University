package com.example.demo.controllers;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Student_Dim;
import com.example.demo.services.StudentService;

@RestController
public class AppController {
	
	@Autowired
	private StudentService studentService;
	
	//HANDLER METHODS
	
	//Display all students data
	@GetMapping("/students")
	public List<Student_Dim> viewStudentPage() {
		return studentService.getAllStudents();
	}
	
	//Display 1 student's data
	@GetMapping("/students/{stu_id}")  
	private Student_Dim getInfo(@PathVariable("stu_id") String stu_id){
		Student_Dim student = studentService.getStudentById(stu_id);
		return student;
	} 
	
	//Create a student_dim (student)
	@PostMapping("/students")  
	private Student_Dim saveOrUpdate(@RequestBody Student_Dim student)  
	{   	
	studentService.saveOrUpdate(student); 
	return student;  
	}
	
	//Create a student_information <- you need to create a student_dim before this!
	@PostMapping("/students/create")  
	private String saveStudentInfo(@RequestBody Student_Dim student)   
	{  
	studentService.saveOrUpdate(student);  
	return student.getStu_id();  
	}
	
	//Edit a student_information
	@PutMapping("/students/{id}")
	public Student_Dim update(@RequestBody Student_Dim student,
	  @PathVariable("id") String stu_id) {
	    studentService.update(student);
	    return student;
	}
}
