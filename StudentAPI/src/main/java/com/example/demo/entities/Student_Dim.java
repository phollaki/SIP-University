package com.example.demo.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name="student_dim")
public class Student_Dim {
	@Id
	@Column(name="stu_id", unique = true)
	private String stu_id;
	@Column
	private String stu_fname;
	@Column
	private String stu_lname;
	@Column
	private String dep_code;
	@Column
	private String fac_code;
	@Column
	private String loc_code;
	@Column
	private String password;
	@Column
	private String marriage_status;
	@Column
	private String address;
	@Column
	private boolean enabled;
	
	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
            )
    private Set<Roles> roles = new HashSet<>();
	
	
	public Student_Dim() {
		super();
	}
	public Student_Dim(String stu_id, String stu_fname, String stu_lname, String dep_code, String fac_code,
			String loc_code, String password, String marriage_status, String address, boolean enabled) {
		super();
		this.stu_id = stu_id;
		this.stu_fname = stu_fname;
		this.stu_lname = stu_lname;
		this.dep_code = dep_code;
		this.fac_code = fac_code;
		this.loc_code = loc_code;
		this.password = password;
		this.marriage_status = marriage_status;
		this.address = address;
		this.enabled = enabled;
	}
	public String getStu_id() {
		return stu_id;
	}
	public void setStu_id(String stu_id) {
		this.stu_id = stu_id;
	}
	public String getStu_fname() {
		return stu_fname;
	}
	public void setStu_fname(String stu_fname) {
		this.stu_fname = stu_fname;
	}
	public String getStu_lname() {
		return stu_lname;
	}
	public void setStu_lname(String stu_lname) {
		this.stu_lname = stu_lname;
	}
	public String getDep_code() {
		return dep_code;
	}
	public void setDep_code(String dep_code) {
		this.dep_code = dep_code;
	}
	public String getFac_code() {
		return fac_code;
	}
	public void setFac_code(String fac_code) {
		this.fac_code = fac_code;
	}
	public String getLoc_code() {
		return loc_code;
	}
	public void setLoc_code(String loc_code) {
		this.loc_code = loc_code;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getMarriage_status() {
		return marriage_status;
	}
	public void setMarriage_status(String marriage_status) {
		this.marriage_status = marriage_status;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public boolean isEnabled() {
		return enabled;
	}
	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public Set<Roles> getRoles() {
		return roles;
	}
	public void setRoles(Set<Roles> roles) {
		this.roles = roles;
	}
}
