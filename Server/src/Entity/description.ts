import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { Levels } from './levels';


@Entity()
export class Description {
  @PrimaryColumn()
  description_id: string;

  @Column('text')
  description_text: string;

  @ManyToOne(() => Levels, (level) => level.descriptions)
  level: Levels
  
}