import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./profile";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    email: string

    @Column()
    password: string

    @CreateDateColumn({
        type: "timestamp"
    })
    create_Date: Date

    @OneToOne(() => Profile, profile => profile.user)
    profile: Profile;
}