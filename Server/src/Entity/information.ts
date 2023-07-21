import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, ManyToOne}from 'typeorm';
import { Description } from './description';
import { Skills } from './skills';
import { User } from './user';


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

    @ManyToOne(() => User, (user) => user.informations)
    user: User[];
}
