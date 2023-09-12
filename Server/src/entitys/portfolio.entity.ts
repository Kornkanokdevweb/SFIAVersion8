import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Experience } from './experience.entity';
import { Link } from './link.entity';
import { Education } from './education.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.portfolio)
  user: User;

  @OneToMany(() => Experience, (experience) => experience.portfolio)
  experience: Experience[];
Z
  @OneToMany(() => Link, (link) => link.portfolio)
  link: Link[];

  @OneToMany(() => Education, (education) => education.portfolio)
  education: Education[];

}
