import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Education } from './education';
import { Link } from './link';
import { Experience } from './experience';

@Entity()
export class Portfolio{
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => Education, education => education.portfolio)
    education: Education[]
    
    @OneToMany(() => Link, link => link.portfolio)
    link: Link[]

    @OneToMany(() => Experience, experience => experience.portfolio)
    experience: Experience[]

}