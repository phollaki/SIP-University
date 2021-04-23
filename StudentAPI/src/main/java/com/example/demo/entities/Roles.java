package com.example.demo.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="roles")
public class Roles {
	
	@Id
	@Column(name="role_id")
	private Long role_id;
	
	@Column(name="role_name")
	private String role_name;
	
	public Roles(Long role_id, String role_name) {
		super();
		this.role_id = role_id;
		this.role_name = role_name;
	}

	public Long getRole_id() {
		return role_id;
	}

	public void setRole_id(Long role_id) {
		this.role_id = role_id;
	}

	public String getRole_name() {
		return role_name;
	}

	public void setRole_name(String role_name) {
		this.role_name = role_name;
	}

	public Roles() {
		super();
	}
	
	
}
