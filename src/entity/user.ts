import { Service } from "typedi";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Service()
@Entity({ name: "student_dim" })
export default class Student {
  @PrimaryColumn({
    type: "varchar",
    name: "stu_id",
    unique: true,
    length: 9,
  })
  STU_ID?: string;

  @Column({ type: "varchar", name: "stu_fname", length: 20 })
  STU_FNAME?: string;

  @Column({ type: "varchar", name: "stu_lname", length: 20 })
  STU_LNAME?: string;

  @Column({ type: "varchar", name: "fac_code", length: 9 })
  FAC_CODE?: string;

  @Column({ type: "varchar", name: "dep_code", length: 4 })
  DEP_CODE?: string;

  @Column({ type: "varchar", name: "loc_code", length: 9 })
  LOC_CODE?: string;
  @Column({ type: "varchar", name: "hashed_password" })
  HASHED_PASSWORD?: string;

  ROLE: string = "student";
}
