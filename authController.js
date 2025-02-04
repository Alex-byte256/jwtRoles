const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {validationResult} = require('express-validator');
const {secret} = require("./config");

const generateToken = (id,roles)=>{
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload,secret,{expiresIn:'24h'});
};

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'registration failed',errors});
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({username});
            if (candidate) {
                return res.status(400).json({
                    message:"User already exists"
                })
            }
            const hashedPassword = await bcrypt.hashSync(password,7);
            const userRole = await Role.findOne({value:"USER"})
            const user = new User ({username,password: hashedPassword,roles:[userRole.value]});
            await user.save()
            return res.status(200).json({message:"Registration successful"})
        }catch(err) {
            console.log(err);
            res.status(400).json({
                message: "registration failed",
            })
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message:"User does not exist"})
            }
            const validPassword = await bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message:"incorrect password"})
            }
            const token = generateToken(user._id,user.roles);
            return res.status(200).json({token})
        }catch(err) {
            console.log(err);

            res.status(400).json({
                message: "login failed",
            })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        }catch(err) {
            console.log(err)
        }
    }
}

module.exports = new authController