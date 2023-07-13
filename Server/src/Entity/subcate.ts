import { Entity, PrimaryGeneratedColumn, Column, OneToOne,JoinColumn } from 'typeorm';
import { Category } from './category_id';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  subcate: string;

  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;
}
