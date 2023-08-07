import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Description {
  @PrimaryColumn()
  description_id: string;

  @Column('text')
  description_text: string;

  @Column()
  level_id: string;
  
}