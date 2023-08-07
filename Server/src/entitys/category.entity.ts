import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Category {
  @PrimaryColumn()
  category_id: string;

  @Column('text')
  category_text: string;

  @Column()
  subcategory_id: string;
  
}
