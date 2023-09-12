import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Information } from './information.entity';

@Entity()
export class Datacollection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.portfolio)
  user: User;

  @OneToMany(() => Information, (information) => information.datacollection)
  information: Information[];

}
