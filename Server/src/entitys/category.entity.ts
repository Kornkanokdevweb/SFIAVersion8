import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Subcategory } from './subcategory.entity';
import { Skills } from './skills.entity';

@Entity()
export class Category {
  @PrimaryColumn()
  id: string;

  @Column('text')
  category_text: string;

  @OneToMany(() => Skills, (skill) => skill.category)
  skill: Skills[];

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.category)
  subcategory: Subcategory;
}
