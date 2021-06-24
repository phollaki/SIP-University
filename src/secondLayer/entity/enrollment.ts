import IEnrollment from 'src/dataLayer/models/enrollment';
import { Column, Entity, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: "entrollment_dim" })
export default class Enrollment implements IEnrollment {
  @PrimaryColumn({
    type: "varchar",
    name: "stu_id",
    length: 9,
    nullable: false,
  })
  STU_ID: string;

  @PrimaryColumn({
    type: "varchar",
    name: "crs_code",
    length: 10,
    nullable: false,
  })
  CRS_CODE: string;
}
