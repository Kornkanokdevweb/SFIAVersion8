import { Entity, PrimaryColumn, Column} from 'typeorm';

@Entity()
export class Standard {
  @PrimaryColumn()
  codeskill: string;

  @Column()
  name_skill: string;

  @Column('text')
  guidance: string;
}
