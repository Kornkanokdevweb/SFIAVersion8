import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable}from 'typeorm';
import { Description } from './description';
import { Skills } from './skills';

@Entity()
export class Information{
    @PrimaryGeneratedColumn()
    info_id: string;

    @Column()
    info_text: string;

    @OneToOne(() => Description)
    @JoinColumn()
    description: Description;

    @ManyToMany(() => Skills)
    @JoinTable()
    skill: Skills[]
}
