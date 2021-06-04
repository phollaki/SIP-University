package com.example.demo.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.example.demo.entities.Student_Dim;

public interface StudentRepository extends CrudRepository<Student_Dim, String> {
	@Query("SELECT st from Student_Dim st where st.stu_id =: username")
	public Student_Dim getStudentByUsername(@Param("stu_id") String username);

	
}
