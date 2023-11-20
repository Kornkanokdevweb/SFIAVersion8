import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm";
import { Portfolio } from "./portfolio.entity";
import { Datacollection } from "./datacollection.entity";
    
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
      default: 'noimage.jpg',
      nullable: true
    })
    profileImage: string;
  
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
    phone: string;
  
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

    @OneToMany(() => Datacollection, (datacollection) => datacollection.user)
    datacollection: Datacollection[];
  
    @CreateDateColumn({
      type: "timestamp",
    })
    created_at: Date;
  
    @UpdateDateColumn({
      type: "timestamp"
    })
    updated_at: Date;
  }
  