import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn }from 'typeorm';

@Entity()
export class Information{
    @PrimaryGeneratedColumn()
    info_id: string;

    @Column('text')
    info_text: string;

    @Column()
    user_id: string;

    @Column()
    description_id: string;

    @Column()
    level_id: string;

    @Column()
    codeskill: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    created_at: Date;

}
