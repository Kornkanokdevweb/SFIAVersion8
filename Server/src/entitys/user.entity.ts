import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, OneToMany } from "typeorm";
import { Portfolio } from "./portfolio.entity";
import { Information } from "./information.entity";
    
  @Entity()
  @Unique("my_unique_constraint", ["email"])
  export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({
      unique: true,
      nullable: false
    })
    email: string;
  
    @Column({
      nullable: false
    })
    password: string;
  
    @Column({
      nullable: true,
    })
    firstNameTH: string;
  
    @Column({
      nullable: true,
    })
    lastNameTH: string;
  
    @Column({
      nullable: true,
    })
    firstNameEN: string;
  
    @Column({
      nullable: true,
    })
    lastNameEN: string;
  
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

    @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
    portfolio: Portfolio[];

    @OneToMany(() => Information, (information) => information.user)
    informations: Information[]
  
    @CreateDateColumn({
      type: "timestamp",
    })
    created_at: Date;
  
    @CreateDateColumn({
      type: "timestamp"
    })
    updated_at: Date;
  }
  