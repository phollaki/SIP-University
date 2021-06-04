import Faculty from 'src/dataLayer/models/faculty';
import {
    Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, RelationId
} from 'typeorm';

import ICourse from '../../dataLayer/models/course';

@Entity({ name: "course_dim" })
export default class Course implements ICourse {
  FACULTY: Faculty;
  @PrimaryColumn({
    type: "varchar",
    name: "crs_code",
    unique: true,
    length: 10,
  })
  CRS_CODE: string;

  @Column({ type: "varchar", name: "crs_title", unique: true, length: 30 })
  CRS_TITLE: string;

  @Column({ type: "varchar", name: "fac_code", length: 9 })
  FAC_CODE: string;

  @Column({ type: "varchar", name: "ins_id", length: 9 })
  INS_ID: string;

  @Column({ type: "varchar", name: "dep_code", length: 4 })
  DEP_CODE: string;

  TESt: string;
}
