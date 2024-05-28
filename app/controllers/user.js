import User from "../models/user.js";
import { AppErrorNotExist } from "../utils/errors.js";
import UserDto from "../dtos/user-dto.js";
export default {
    async getUser(req, res) {
      if (req.user == null) res.redirect('/');
      const user = await User.findByPk(req.user);
      if (!user) throw new AppErrorNotExist('user');
      const userDto = new UserDto(user);
      res.json(userDto);
    },
};
