import { Entity, PrimaryColumn, Column, OneToOne,JoinColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryColumn()
  category_id: string;

  @Column('text')
  category_text: string;
  
}
