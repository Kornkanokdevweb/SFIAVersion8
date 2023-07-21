import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    fname_th: string

    @Column()
    lname_th: string

    @Column({nullable: true})
    fname_en: string

    @Column({nullable: true})
    lname_en: string

    @Column()
    phone: number

    @Column()
    line: string

    @Column()
    address: string

    @CreateDateColumn({
        type: "timestamp"
    })
    update_Date: Date

    @OneToOne(() => User, user => user.profile, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;
}