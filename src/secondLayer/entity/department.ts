import IDepartment from 'src/dataLayer/models/department';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: "department" })
export default class Department implements IDepartment {
  @PrimaryColumn({
    type: "varchar",
    name: "dep_code",
    unique: true,
    length: 4,
  })
  DEP_CODE: string;

  @Column({ type: "varchar", name: "dep_name", length: 40 })
  DEP_NAME: string;

  @Column({ type: "varchar", name: "fac_code", length: 9 })
  FAC_CODE: string;

  @Column({ type: "varchar", name: "loc_code", length: 9 })
  LOC_CODE: string;
}
