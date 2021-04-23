package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Student_Dim;
import com.example.demo.exceptions.StudentIdIsAlreadyExists;
import com.example.demo.exceptions.StudentNotFoundException;
import com.example.demo.repositories.StudentRepository;

@Service
public class StudentService {
	
	@Autowired
	StudentRepository studentRepository;
	
	public List<Student_Dim> getAllStudents() {
		List<Student_Dim> students = new ArrayList<Student_Dim>();
		studentRepository.findAll().forEach(student1 -> students.add(student1));
		students.removeIf(s->s.getStu_id().equals("admin"));
		return students;
	}

	public Student_Dim getStudentById(String stu_id) {  
		return studentRepository.findById(stu_id).orElseThrow(()->new StudentNotFoundException("Student with the given stud_id is not found"));
	}
	
	public void saveOrUpdate(Student_Dim student){
		Optional<Student_Dim> optionalEvent= this.studentRepository.findById(student.getStu_id());
	    if (optionalEvent.isPresent()) {
	        throw new StudentIdIsAlreadyExists("Student with id: " + student.getStu_id() + " is already exists");
	    }
		else studentRepository.save(student);
	}  

	public void update(Student_Dim student)   
	{ 
		Student_Dim existingStudentDetails = findStudent(student.getStu_id());
		if(student.getPassword() != null) {
			existingStudentDetails.setPassword(student.getPassword());
		}
		if(student.getAddress() != null) {
			existingStudentDetails.setAddress(student.getAddress());
		}
		if(student.getMarriage_status() != null) {
			existingStudentDetails.setMarriage_status(student.getMarriage_status());
		}
		studentRepository.save(existingStudentDetails);
	}

	public void delete(String stu_id) {
		Student_Dim student = studentRepository.findById(stu_id)
			.orElseThrow(()->new IllegalArgumentException("Invalid student id"));
		studentRepository.delete(student);
	}

	public Student_Dim findStudent(String id) {
		Student_Dim student = studentRepository.findById(id)
				.orElseThrow(()-> new IllegalArgumentException("Student id is not found!"));
		return student;
	}
}


