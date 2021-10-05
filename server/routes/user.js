const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models/index");

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "studyweb-auth@outlook.com",
        pass: "passpass123!"
    }
})



/**
 * This function adds a user into the database.
 * @param {string} name name of the user
 * @param {string} email email of the user
 * @param {string} hashedPass hashed password
 */
async function addUser(name, email, hashedPass, confirmed) {
    const result = await sequelize
        .query("INSERT INTO users (name, email, password, confirmed) VALUES (?, ?, ?, ?)", {
            replacements: [name, email, hashedPass, confirmed],
        })
        .catch((error) => {
            console.log(error);
        });

    return result;
}




/**
 * This function returns an array of the users that match the email provided.
 * If this returned array's length is 0, then the database does not contain
 * a user with that email yet.
 * @param {string} email the email that the database checks to see if it has it already
 */
async function checkEmailExist(email) {
    const users = await sequelize.query("SELECT * FROM users WHERE (email = ? AND confirmed = 1)", {
        replacements: [email],
        type: QueryTypes.SELECT,
    });
    return users;
}

async function confirmUserAndDeleteUnconfirmedUsers(id, email) {
    await sequelize
        .query("UPDATE users SET confirmed = 1 WHERE id = ?", {
            replacements: [id],
            returning: true,
        })
        .catch((error) => {
            console.log(error);
        });
    await sequelize
        .query("DELETE FROM users WHERE (email = ? AND confirmed = 0)", {
            replacements: [email],
        })
        .catch((error) => {
            console.log(error);
        });
}

router.get('/confirmation/:token', async (req, res) => {
    let { token } = req.params;

    await jwt.verify(token, process.env.SECRET_EMAIL, async function (err, decoded) {
        if (err) {
            console.log(`Problem with link in email: ${err}`)
            res.json({
                message: err
            })
        } else {
            const result = await confirmUserAndDeleteUnconfirmedUsers(decoded.id, decoded.email)
            res.json({
                message: 'Email successfully confirmed. You may log into your account now!'
            })
            // res.redirect('http://localhost:3001/')
        }
    });
})

async function sendEmail(email, token) {
    try {
        const url = `http://localhost:3000/api/v1/users/confirmation/${token}`;
        await transporter.sendMail({
            from: transporter.options.auth.user,
            to: email,
            subject: 'Confirm StudyWeb Email',
            html: `Please click this to confirm email: <a href=${url}>${url}</a>`
        }, (info, error) => {
            if (error) console.log(error)
        })
    } catch (error) {
        console.log('Error with sending email')
        console.log(error)
    }
}

async function createConfirmToken(user) {
    try {
        const token = jwt.sign(
            {
                name: user.name,
                id: user.id,
                email: user.email,
            },
            process.env.SECRET_EMAIL,
            {
                expiresIn: '1d',
            }
        )
        return token

    } catch (error) {
        console.log('Error with creating token')
        console.log(error)
    }
}



/**
 * This route registers a user.
 * @body name: name of the user
 * @body email: email of the user
 * @body password: password of the user (will be encrypted)
 */


/**
 * Signing up 
 * First check, is the email already there, if yes, is it confirmed. 
 * If both true, account is already used. 
 * Else account is unused. And we wanna put the account in. 
 */
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    let users = await checkEmailExist(email);
    console.log(users)
    if (users.length != 0 && users[0].confirmed) {
        res.json({
            status: 'fail',
            error: "Email already used!"
        });
    } else {
        let hashedPass = await bcrypt.hash(password, 10);
        const result = await addUser(name, email, hashedPass, false);

        const user = {
            name,
            id: result[0],
            email,
        }
        const confirmToken = await createConfirmToken(user);
        await sendEmail(email, confirmToken)
        if (process.env.NODE_ENV == 'development') {
            res.json({
                status: "success",
                user,
                confirmToken,
                result,
            });
        } else {
            res.json({
                status: "success",
                user,
                result,
            });
        }

    }
});

/**
 * This route logs a user in
 */
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const users = await checkEmailExist(email);
    if (users.length === 0) {
        res.json({
            status: 'fail',
            error: "There are no users with this email who have confirmed their account yet!"
        });
        
    } else {
        bcrypt
            .compare(password, users[0].password)
            .then((match) => {
                if (!match) {
                    res.json({
                        status: 'fail',
                        error: "Wrong username and password combination!"
                    });
                } else {
                    const accessToken = jwt.sign(
                        { name: users[0].name, id: users[0].id },
                        process.env.SECRET_JWT
                    );
                    res.json({
                        status: 'success',
                        name: users[0].name,
                        id: users[0].id,
                        token: accessToken,
                    });
                }
            })
            .catch((error) => console.log(error));
    }
});

router.post("/google_auth", async (req, res) => {
    const { name, email, password } = req.body;
    let users = await checkEmailExist(email);
    let accountUsed = users.length;
    let result;

    if (!accountUsed) {
        let hashedPass = await bcrypt.hash(password, 10);
        result = await addUser(name, email, hashedPass, true)
        const accessToken = jwt.sign(
            { name, id: result[0] },
            process.env.SECRET_JWT
        );
        res.json({
            status: 'success',
            name,
            id: result[0],
            token: accessToken,
        });
    } else {
        // this means there exists a confirmed account with that email. 
        // user could actually be trying to log in
        try {
            const match = await bcrypt.compare(password, users[0].password)
            if (!match) {
                res.json({
                    status: 'fail',
                    error: "The email you are signing into already has an account"
                });
            } else {
                const accessToken = jwt.sign(
                    { name: users[0].name, id: users[0].id },
                    process.env.SECRET_JWT
                );
                res.json({
                    status: 'success',
                    name: users[0].name,
                    id: users[0].id,
                    token: accessToken,
                });
            }
        } catch (error) {
            console.log(error)
        }

    }

});



module.exports = router;
