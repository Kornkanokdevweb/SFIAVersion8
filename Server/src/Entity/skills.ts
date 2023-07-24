import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { Category } from './category';
import { Levels } from './levels';

@Entity()
export class Skills {
  @PrimaryColumn()
  codeskill: string;

  @Column()
  skill_name: string;

  @Column('text')
  overall: string;

  @Column('text')
  note: string;

  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;

  @OneToMany(() => Levels, (level) => level.skill)
  levels: Levels[]
}
