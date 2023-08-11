import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Subcategory {
  @PrimaryColumn()
  id: string;

  @Column('text')
  subcategory_text: string;

  @OneToMany(() => Category, (category) => category.subcategory)
  category: Category[];

}
