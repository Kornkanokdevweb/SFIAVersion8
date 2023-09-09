import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne}from 'typeorm';
import { Skills } from './skills.entity';
import { User } from './user.entity';
import { Levels } from './levels.entity';
import { Description } from './description.entity';


@Entity()
export class Information{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    info_text: string;

    @ManyToOne(() => Description)
    descriptions: Description;

    @ManyToOne(() => User, (user) => user.informations)
    user: User;

    
}