import { Request, Response } from "express";
import { request } from "http";
import { AppDataSource } from "../data-source";
import { User } from "../models/User"; //import of models when are the fields of table
import { Rol } from "../models/Rol";
import { Repository } from "typeorm";

//Method by get
class UsersController {
  static listUsers = async (req: Request, res: Response) => {
    const repoUsers = AppDataSource.getRepository(User);

    try {
      const users = await repoUsers.find({
        where: { state: true },
      });

      return users
        ? res.json({
            ok: true,
            msg: "list of roles",
            users,
          })
        : res.json({ ok: false, msg: "data not found", users });
    } catch (e) {
      return res.json({
        ok: false,
        msg: `Error = ${e}`,
      });
    }
  };

  //Method by save
  static createUsers = async (req: Request, res: Response) => {
    const { email, pass, rolId } = req.body;
    const repoUsers = AppDataSource.getRepository(User);
    const rolRepository = AppDataSource.getRepository(Rol)
    try {
      const existingUser = await repoUsers.findOne({ where: { email } });
      if (existingUser) {
        return res.json({ ok: false, msg: `Email '${email}' already exists` });
      }
      let existingRol
      if (rolId) {
        existingRol = await rolRepository.findOne({ where: { id: rolId } })
        if (!existingRol) {
          return res.json({
            ok: false,
            msg: `Role with ID '${rolId}' does not exist`,
          })
        }
      } else {
        const existingSuperAdmin = await repoUsers.findOne({
          where: { rol: { rol: 'SuperAdministrador' } },
        })

        if (!existingSuperAdmin) {
          existingRol = await createSuperAdminRole(rolRepository)
        } else {
          return res.json({
            ok: false,
            msg: 'A user with the role SuperAdministrador already exists',
          })
        }
      }

      if (existingRol?.rol === 'SuperAdministrador' && rolId) {
        return res.json({
          ok: false,
          msg: 'Cannot assign the role SuperAdministrador to a regular user',
        })
      }
      const users = new User();

      users.email = email;
      users.pass = pass
      users.rol = existingRol;
      users.hashPassword()

      const savedUser = await repoUsers.save(users)
      savedUser.pass = undefined
      return res.json({
        ok: true,
        msg: "Users was create",
        users,
        user: savedUser
      });
    } catch (e) {
      return res.json({
        ok: false,
        msg: `Error => ${e}`,
      });
    }
  };

  static byIdUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoUsers = AppDataSource.getRepository(User);

    try {
      const users = await repoUsers.findOne({
        where: { id },
      });
      return users
        ? res.json({
            ok: true,
            users,
          })
        : res.json({
            ok: false,
            msg: "The id dont exist",
          });
    } catch (e) {
      return res.json({
        ok: false,
        msg: " server error",
      });
    }
  };

  //Method of update User
  static updateUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const { email, pass, rolId } = req.body;
    const repoUser = AppDataSource.getRepository(User);
    let user: User;
    try {
      user = await repoUser.findOneOrFail({
        where: { id, state: true },
      });
      if (!user) {
        throw new Error("User dont exist in data base");
      }
      user.email = email;
      user.pass = pass;
      user.rol = rolId;
      await repoUser.save(user);
      return res.json({
        ok: true,
        msg: "User was update",
      });
    } catch (error) {
      return res.json({
        ok: false,
        msg: "Server error",
      });
    }
  };

  //Method to delete
  static deleteUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repoUser = AppDataSource.getRepository(User);
    try {
      const user = await repoUser.findOne({
        where: { id },
      });

      console.log(user);
      if (!user) {
        throw new Error("User dont exist in data base");
      }
      user.state = false;
      await repoUser.save(user);
      return res.json({
        ok: true,
        msg: "User was delete",
      });
    } catch (e) {
      return res.json({
        ok: false,
        msg: "Server error",
      });
    }
  };
}

export default UsersController;
function createSuperAdminRole(rolRepository: Repository<Rol>): any {
    throw new Error("Function not implemented.");
}

