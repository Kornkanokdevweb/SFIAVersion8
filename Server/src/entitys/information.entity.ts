import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, CreateDateColumn}from 'typeorm';
import { Description } from './description.entity';
import { Datacollection } from './datacollection.entity';

@Entity()
export class Information{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    info_text: string;

    @ManyToOne(() => Description)
    description: Description;

    @ManyToOne(() => Datacollection, (datacollection) => datacollection.information)
    datacollection: Datacollection;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;
  
}
