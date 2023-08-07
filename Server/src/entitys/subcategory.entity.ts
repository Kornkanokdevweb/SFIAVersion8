import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Subcategory {
  @PrimaryColumn()
  id: string;

  @Column('text')
  subcate: string;

}
