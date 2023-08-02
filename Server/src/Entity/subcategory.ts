import { Entity, PrimaryColumn, Column, OneToOne,JoinColumn } from 'typeorm';

@Entity()
export class Subcategory {
  @PrimaryColumn()
  id: string;

  @Column('text')
  subcate: string;


}
