package com.example.demo.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.example.demo.entities.Student_Dim;

public interface UserRepository extends CrudRepository<Student_Dim, String> {
	@Query("SELECT u FROM Student_Dim u WHERE u.stu_id = :username")
    public Student_Dim getUserByUsername(@Param("username") String username);
}
