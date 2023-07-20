import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
    [x: string]: any;
    @PrimaryGeneratedColumn("uuid")
    user_id: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    fname_th: string

    @Column()
    lname_th: string

    @Column()
    fname_en: string

    @Column()
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
    date: Date
}