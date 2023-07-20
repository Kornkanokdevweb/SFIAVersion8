import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { Levels } from './levels';


@Entity()
export class Description {
  @PrimaryGeneratedColumn()
  description_id: string;

  @Column('text')
  category_text: string;

  @ManyToOne(() => Levels, (level) => level.descriptions)
  level: Levels
  
}