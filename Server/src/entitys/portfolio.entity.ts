import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  portfolio_id: number;

  @Column()
  user_id: string;
}
