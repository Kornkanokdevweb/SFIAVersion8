import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fname_th: string

    @Column()
    lname_th: string

    @Column()
    fname_eng: string

    @Column()
    lname_eng: string

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