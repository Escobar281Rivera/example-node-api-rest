import { Request, Response } from 'express'
import { User } from '../models/User'
import { AppDataSource } from '../data-source'
import bcrypt from 'bcrypt'
import { tokenSign } from '../helper/jwt.helper'


const authRepository = AppDataSource.getRepository(User)

class AuthController {
  static login = async (req: Request, res: Response) => {
    const { email, pass } = req.body

    try {
      const user = await authRepository.findOne({ where: { email } })

      if (!user || !bcrypt.compareSync(pass, user.pass)) {
        return res
          .status(401)
          .json({ ok: false, message: 'email or password incorrect' })
      }

      const token = await tokenSign(user)


      return res.json({
        msg: 'Welcome',
        token,
      })
      
    } catch (error) {
      return res.json({ ok: false, message: error.message })
    }
  }
}
export default AuthController