import { Entity, PrimaryColumn, Column, OneToOne,JoinColumn } from 'typeorm';
import { Subcategory } from './subcategory';

@Entity()
export class Category {
  @PrimaryColumn()
  category_id: string;

  @Column('text')
  category_text: string;

  @OneToOne(() => Subcategory)
  @JoinColumn()
  subcategory: Subcategory;
  
}
