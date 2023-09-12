import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne}from 'typeorm';
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

    
}