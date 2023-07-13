import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Standard } from './standard.entity';

@Entity()
export class LevelSkill {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  level1: string;

  @Column('text')
  level2: string;

  @Column('text')
  level3: string;

  @Column('text')
  level4: string;

  @Column('text')
  level5: string;

  @Column('text')
  level6: string;

  @Column('text')
  level7: string;

  @OneToOne(() => Standard)
  @JoinColumn()
  Standard: Standard;
}