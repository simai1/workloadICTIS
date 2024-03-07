import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import * as querystring from 'querystring';
import axios from 'axios';
import jwt from '../utils/jwt.js';
import UserDto from '../dtos/user-dto.js';
import User from '../models/user.js';

export default {
    async loginSfedu({ body: { code, codeVerifier } }, res) {
        const { data } = await axios.post(
            'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            querystring.stringify({
                client_id: process.env.SFEDU_ID,
                client_secret: process.env.SFEDU_SECRET,
                scope: 'openid',
                code,
                codeVerifier,
                redirect_uri: `${process.env.WEB_URL}/auth/test`,
                grant_type: 'authorization_code',
            })
        );
        console.log(data.accessToken);
        res.json();
    },

    async test(req, res) {
        console.log('test');
        res.json();
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
        const { accessToken, refreshToken } = jwt.generate({ ...userDto });

        await jwt.saveToken(userDto.id, refreshToken);

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
