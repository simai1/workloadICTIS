import { AppErrorAlreadyExists, AppErrorMissing, AppErrorNotExist } from '../utils/errors.js';
// import * as querystring from 'querystring';
// import axios from 'axios';
import jwtUtil from '../utils/jwt.js';
import UserDto from '../dtos/user-dto.js';
import User from '../models/user.js';
import Educator from '../models/educator.js';

export default {
    async test(req, res) {
        res.send(req.user);
    },

    async login({ body: { login, password, name } }, res) {
        if (!login) throw new AppErrorMissing('login');
        if (!password) throw new AppErrorMissing('password');
        if (!name) throw new AppErrorMissing('name');

        const CheckUser = await User.findOne({ where: { login } });
        if (CheckUser) throw new AppErrorAlreadyExists('user');

        const user = await User.create({
            login,
            password,
            name,
        });

        const userDto = new UserDto(user);
        const { accessToken, refreshToken } = jwtUtil.generate({ ...userDto });

        await jwtUtil.saveToken(userDto.id, refreshToken);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userDto,
        });
    },

    async loginForTest({ body: { login} }, res) {
        if (!login) throw new AppErrorMissing('login');

        const CheckUser = await User.findOne({ where: { login }, include: [{ model: Educator }] });
        if (!CheckUser) throw new AppErrorNotExist('user');

        const userDto = new UserDto(CheckUser);
        const { accessToken, refreshToken } = jwtUtil.generate({ ...userDto });

        await jwtUtil.saveToken(userDto.id, refreshToken);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userDto,
        });
    },
};
