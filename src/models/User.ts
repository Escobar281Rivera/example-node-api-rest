import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from "typeorm";
import { Rol } from "./Rol";//importo rol porque es foranea
import bcrypt from 'bcrypt'

@Entity()
export class User {
    @PrimaryGeneratedColumn()//Primarykey
    id: number

    @ManyToOne(() => Rol)//MaytoOne crea una variable de linkeo
    rol: Rol

    @RelationId((user: User) => user.rol)// accede a los atributos de usuario
    rolId: number

    @Column()
    email: string

    @Column()
    pass: string

    @Column({ default: true })
    state: boolean

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10)
        this.pass = bcrypt.hashSync(this.pass, salt)
}

}