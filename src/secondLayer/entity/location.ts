import ILocation from 'src/dataLayer/models/location';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: "location_dim" })
export default class Location implements ILocation {
  @PrimaryColumn({
    type: "varchar",
    name: "loc_code",
    unique: true,
    length: 5,
  })
  LOC_CODE: string;

  @Column({ type: "varchar", name: "loc_name", length: 40, unique: true })
  LOC_NAME: string;

  @Column({ type: "varchar", name: "loc_country", length: 3, unique: true })
  LOC_COUNTRY: string;
}
