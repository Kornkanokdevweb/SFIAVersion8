import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Portfolio {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  portfolio_id: number;

  @ManyToOne(() => User, (user) => user.portfolios)
  user: User;

}
