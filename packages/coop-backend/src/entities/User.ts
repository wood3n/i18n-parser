import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("User")
export class User {
  @PrimaryGeneratedColumn({
    name: "Id",
  })
  id: number;

  @Column({
    name: "Name",
  })
  name: string;
}
