package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.entities.Student_Dim;
import com.example.demo.exceptions.InternalServerError;
import com.example.demo.exceptions.StudentIdIsAlreadyExists;
import com.example.demo.exceptions.StudentNotFoundException;
import com.example.demo.repositories.StudentRepository;

import javassist.NotFoundException;

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
		Student_Dim student = studentRepository.findById(stu_id).orElseThrow(()-> new StudentNotFoundException("No student with given Id"));
		return student;
	}
	

	public List<Student_Dim> getStudentByDep(String dep_code) {
		List<Student_Dim> students = new ArrayList<Student_Dim>();
		List<Student_Dim> studentswithdepartment = new ArrayList<Student_Dim>();
		studentRepository.findAll().forEach(student1 -> students.add(student1));
		for (int i = 0; i < students.size(); i++) {
			if(students.get(i).getDep_code().equals(dep_code)) {
				studentswithdepartment.add(students.get(i));
			}
		}
		studentswithdepartment.removeIf(s->s.getStu_id().equals("admin"));
		if(studentswithdepartment.isEmpty()) {
			throw new StudentNotFoundException("No student with given department code");
		}
		return studentswithdepartment;
	}

	public List<Student_Dim> getStudentByFac(String fac_code) {
		List<Student_Dim> students = new ArrayList<Student_Dim>();
		List<Student_Dim> studentswithfaculty = new ArrayList<Student_Dim>();
		studentRepository.findAll().forEach(student1 -> students.add(student1));
		for (int i = 0; i < students.size(); i++) {
			if(students.get(i).getFac_code().equals(fac_code)) {
				studentswithfaculty.add(students.get(i));
			}
		}
		studentswithfaculty.removeIf(s->s.getStu_id().equals("admin"));
		if(studentswithfaculty.isEmpty()) {
			throw new StudentNotFoundException("No student with given faculty code");
		}
		return studentswithfaculty;
	}

	public List<Student_Dim> getStudentByLoc(String loc_code) {
		List<Student_Dim> students = new ArrayList<Student_Dim>();
		List<Student_Dim> studentswithlocation = new ArrayList<Student_Dim>();
		studentRepository.findAll().forEach(student1 -> students.add(student1));
		for (int i = 0; i < students.size(); i++) {
			if(students.get(i).getLoc_code().equals(loc_code)) {
				studentswithlocation.add(students.get(i));
			}
		}
		studentswithlocation.removeIf(s->s.getStu_id().equals("admin"));
		if(studentswithlocation.isEmpty()) {
			throw new StudentNotFoundException("No student with given location code");
		}
		return studentswithlocation;
	}

	public List<Student_Dim> getStudentByFname(String stu_fname) {
		List<Student_Dim> students = new ArrayList<Student_Dim>();
		List<Student_Dim> studentswithfname = new ArrayList<Student_Dim>();
		studentRepository.findAll().forEach(student1 -> students.add(student1));
		for (int i = 0; i < students.size(); i++) {
			if(students.get(i).getStu_fname().equals(stu_fname)) {
				studentswithfname.add(students.get(i));
			}
		}
		studentswithfname.removeIf(s->s.getStu_id().equals("admin"));
		if(studentswithfname.isEmpty()) {
			throw new StudentNotFoundException("No student with given first name");
		}
		return studentswithfname;
	}

	public List<Student_Dim> getStudentBylname(String stu_lname) {
		List<Student_Dim> students = new ArrayList<Student_Dim>();
		List<Student_Dim> studentswithlname = new ArrayList<Student_Dim>();
		studentRepository.findAll().forEach(student1 -> students.add(student1));
		for (int i = 0; i < students.size(); i++) {
			if(students.get(i).getStu_lname().equals(stu_lname)) {
				studentswithlname.add(students.get(i));
			}
		}
		studentswithlname.removeIf(s->s.getStu_id().equals("admin"));
		if(studentswithlname.isEmpty()) {
			throw new StudentNotFoundException("No student with given last name");
		}
		return studentswithlname;
	}

	public List<Student_Dim> getStudentByMarriageStatus(String marriagestatus) {
		List<Student_Dim> students = new ArrayList<Student_Dim>();
		List<Student_Dim> studentswithmarriagestatus = new ArrayList<Student_Dim>();
		studentRepository.findAll().forEach(student1 -> students.add(student1));
		for (int i = 0; i < students.size(); i++) {
			if(students.get(i).getMarriage_status() != null && students.get(i).getMarriage_status().equals(marriagestatus)) {
				studentswithmarriagestatus.add(students.get(i));
			}
		}
		studentswithmarriagestatus.removeIf(s->s.getStu_id().equals("admin"));
		if(studentswithmarriagestatus.isEmpty()) {
			throw new StudentNotFoundException("No student with given marriage status");
		}
		return studentswithmarriagestatus;
	}

	public List<Student_Dim> getStudentByAddress(String address) {
		List<Student_Dim> students = new ArrayList<Student_Dim>();
		List<Student_Dim> studentswithaddress = new ArrayList<Student_Dim>();
		studentRepository.findAll().forEach(student1 -> students.add(student1));
		for (int i = 0; i < students.size(); i++) {
			if(students.get(i).getAddress() != null && students.get(i).getAddress().equals(address)) {
				studentswithaddress.add(students.get(i));
			}
		}
		studentswithaddress.removeIf(s->s.getStu_id().equals("admin"));
		if(studentswithaddress.isEmpty()) {
			throw new StudentNotFoundException("No student with given address");
		}
		return studentswithaddress;
	}
	

	public void saveOrUpdate(Student_Dim student){
		Optional<Student_Dim> optionalEvent= this.studentRepository.findById(student.getStu_id());
	    if(student.getStu_id().isEmpty()) {
	    	throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY);
	    }
		if (optionalEvent.isPresent()) {
	        throw new StudentIdIsAlreadyExists("Student with id: " + student.getStu_id() + " is already exists");
	    }
		else studentRepository.save(student);
	}  
	
	public void update(Student_Dim student)   
	{   
		Student_Dim existingStudentDetails = findStudent(student.getStu_id());
		existingStudentDetails.setFac_code(student.getFac_code());
		existingStudentDetails.setStu_id(student.getStu_id());
		existingStudentDetails.setLoc_code(student.getLoc_code());
		existingStudentDetails.setDep_code(student.getDep_code());
		existingStudentDetails.setStu_fname(student.getStu_fname());
		existingStudentDetails.setStu_lname(student.getStu_lname());
		
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


