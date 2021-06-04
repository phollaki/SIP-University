import { Column, Entity, PrimaryColumn } from 'typeorm';

import IFaculty from '../../dataLayer/models/faculty';

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
