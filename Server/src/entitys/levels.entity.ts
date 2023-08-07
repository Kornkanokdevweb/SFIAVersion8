import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Levels {
  @PrimaryGeneratedColumn()
  level_id: string;

  @Column()
  level_name: string;

  @Column()
  codeskill: string;

}