import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { Levels } from './levels.entity';


@Entity()
export class Description {
  @PrimaryColumn()
  id: string;

  @Column('text')
  description_text: string;

  @ManyToOne(() => Levels, (level) => level.descriptions)
  level: Levels;
  
}