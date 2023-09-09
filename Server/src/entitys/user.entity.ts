import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, OneToMany } from "typeorm";
import { Information } from "./information.entity";
import { Experience } from "./experience.entity";
import { Education } from "./education.entity";
import { Link } from "./link.entity";

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

    @OneToMany(() => Information, (information) => information.user)
    informations: Information[];

    @OneToMany(() => Experience, (experience) => experience.user)
    experiences: Experience[];

    @OneToMany(() => Education, (education) => education.user)
    educations: Experience[];

    @OneToMany(() => Link, (link) => link.user)
    links: Link[];
  
    @CreateDateColumn({
      type: "timestamp",
    })
    created_at: Date;
  
    @CreateDateColumn({
      type: "timestamp"
    })
    updated_at: Date;
  }
  