import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Skills } from './skills';
import { Description } from './description';

@Entity()
export class Levels {
  @PrimaryColumn()
  level_id: string;

  @Column()
  level_name: string;

  @ManyToOne(() => Skills, (skill) => skill.levels)
  skill: Skills

  @OneToMany(() => Description, (description) => description.level)
  descriptions: Levels[]

}