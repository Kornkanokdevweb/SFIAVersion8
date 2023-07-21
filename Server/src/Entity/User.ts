import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, OneToMany } from "typeorm";
import { Profile } from "./profile";
import { Portfolio } from "./portfolio";

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

    @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
    portfolio: Portfolio[]
}