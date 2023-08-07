import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn } from "typeorm";
    
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
  
    @CreateDateColumn({
      type: "timestamp",
    })
    created_at: Date;
  
    @CreateDateColumn({
      type: "timestamp"
    })
    updated_at: Date;
  }
  