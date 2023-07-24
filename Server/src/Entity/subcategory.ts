import { Entity, PrimaryColumn, Column, OneToOne,JoinColumn } from 'typeorm';
import { Category } from './category';

@Entity()
export class Subcategory {
  @PrimaryColumn()
  id: string;

  @Column('text')
  subcate: string;

  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;
}
