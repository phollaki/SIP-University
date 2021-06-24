import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';

import IFaculty from '../../dataLayer/models/faculty';
import Course from './course';

@Entity({ name: "faculty" })
export default class Faculty implements IFaculty {
  @PrimaryColumn({
    type: "varchar",
    name: "fac_code",
    unique: true,
    length: 9,
  })
  FAC_CODE: string;

  @Column({ type: "varchar", name: "fac_name", length: 40 })
  FAC_NAME: string;
}
