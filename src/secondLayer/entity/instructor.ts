import IInstructor from 'src/dataLayer/models/instructor';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import Faculty from './faculty';

@Entity({ name: "instructor_dim" })
export default class Instructor implements IInstructor {
  @PrimaryColumn({
    type: "varchar",
    name: "ins_id",
    unique: true,
    length: 9,
  })
  INS_ID: string;

  @Column({ type: "varchar", name: "ins_fname", length: 20 })
  INS_FNAME: string;

  @Column({ type: "varchar", name: "ins_lname", length: 20 })
  INS_LNAME: string;

  @Column({ type: "varchar", name: "dep_code", length: 4 })
  DEP_CODE: string;

  @Column({ type: "varchar", name: "fac_code", length: 9 })
  FAC_CODE: string;
}
