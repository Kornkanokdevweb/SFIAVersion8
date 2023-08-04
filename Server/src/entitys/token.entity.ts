import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";

@Entity()
export class Token{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    token: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    created_at: Date;

    @Column()
    expired_at: Date;

}