require('dotenv').config();
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const AuthDAO = require('./dao')
const passport = require('passport');

class Authenticator {
    constructor(app) {
        this.app = app;
        this.dao = new AuthDAO();
        this.initAuth();
    }

    initAuth() {
        const copyThis = this;
        this.strategy = new LocalStrategy( {
                usernameField: 'email',
                passwordField: 'password'
            },
            function (username, password, done) {
                copyThis.dao.getUserByEmail(username).then((user) => {
                    if (!user)
                        return done(null, false, { message: 'Incorrect username and/or password.' });

                    return done(null, user);
                })
            }
        )
        passport.use(this.strategy);

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            this.dao.getUserByID(id)
                .then(user => {
                    done(null, user);
                }).catch(err => {
                    done(err, null);
                });
        });

        this.app.use(session({
            secret: process.env.SECRET || "supersecretforawi",
            resave: false,
            saveUninitialized: false
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    login(req, res, next) {
        return new Promise((resolve, reject) => {
            passport.authenticate('local', (err, user, info) => {
                if (err) return resolve(err);
                if (!user) return resolve(info);
    
                req.login(user, (err) => {
                    if (err) return resolve(err);    
                    return resolve(req.user);
                });
            })(req, res, next);
        });
    }

    logout(req, res, next) {
        req.logout( () => { res.status(200).send(); } );
    }

    isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        return res.status(401).json({ error: 'Not authenticated', status: 401 });
    }

    static verifyPassword(plainPassword, inDBPassword, salt) {
        return new Promise((resolve, reject) => {
            crypto.scrypt(plainPassword, salt, 32, (err, hashedPassword) => {
                if (err) resolve(false);
    
                const passwordHex = Buffer.from(inDBPassword, 'hex');
                if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
                    resolve(false);

                resolve(true);
            });
        });
    }
}

module.exports = { Authenticator };