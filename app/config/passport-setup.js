import passport from 'passport';
import AzureAdOAuth2Strategy from 'passport-azure-ad-oauth2';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import jwtUtil from '../utils/jwt.js';
import UserDto from '../dtos/user-dto.js';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
        done(null, user.id);
    });
});
passport.use(
    new AzureAdOAuth2Strategy(
        {
            callbackURL: 'http://localhost/auth/login',
            callbackURL: 'https://workload.sfedu.ru/auth/login',
            clientID: process.env.SFEDU_ID,
            clientSecret: process.env.SFEDU_SECRET,
        },
        async function (accessToken, refreshToken, params, profile, done) {
            const waadProfile = jwt.decode(params.id_token, '', true);
            console.log(profile, jwt.decode(params.id_token, '', true));
            User.findOne({ where: { login: waadProfile.unique_name } }).then(currentUser => {
                if (currentUser) {
                    done(null, currentUser);
                } else {
                    new User({
                        login: waadProfile.unique_name,
                        name: waadProfile.name,
                    })
                        .save()
                        .then(newUser => {
                            done(null, newUser);
                            const userDto = new UserDto(newUser);
                            jwtUtil.saveToken(userDto.id, refreshToken);
                        });
                }
            });
        }
    )
);

export default passport;
