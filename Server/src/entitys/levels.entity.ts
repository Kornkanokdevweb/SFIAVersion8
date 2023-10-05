import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Skills } from './skills.entity';
import { Description } from './description.entity';

@Entity()
export class Levels {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  level_name: string;

  @ManyToOne(() => Skills, (skill) => skill.levels)
  skill: Skills;

  @OneToMany(() => Description, (description) => description.level)
  descriptions: Description[];
}