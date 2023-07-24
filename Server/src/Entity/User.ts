import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Unique,} from "typeorm";
import { Portfolio } from "./portfolio";
import { Information } from "./information";

@Entity()
@Unique("my_unique_constraint", ["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  fname_th: string;

  @Column({
    nullable: true,
  })
  lname_th: string;

  @Column({
    nullable: true,
  })
  fname_en: string;

  @Column({
    nullable: true,
  })
  lname_en: string;

  @Column({
    nullable: true,
  })
  phone: number;

  @Column({
    nullable: true,
  })
  line: string;

  @Column({
    nullable: true,
  })
  address: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  create_Date: Date;

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolio: Portfolio[];

  @OneToMany(() => Information, (information) => information.user)
    informations: Information[]
}
