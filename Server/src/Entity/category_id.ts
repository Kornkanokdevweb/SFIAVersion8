import { Entity, PrimaryGeneratedColumn, Column, OneToOne,JoinColumn } from 'typeorm';
import { Standard } from './standard.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  category: string;

  @OneToOne(() => Standard)
  @JoinColumn()
  Standard: Standard;

}
