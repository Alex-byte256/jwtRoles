const Router = require('express');
const router = new Router();
const controller = require("./authController")
const {check} = require("express-validator");
const authMiddleware = require("./middlewaree/authMiddlewaree");
const roleMiddleware = require("./middlewaree/roleMiddleware");

router.post('/registration',[
    check("username","user name cannot be empty").notEmpty(),
    check("password","length must be 4-10 symbols").isLength({min:4, max:10}),
],controller.registration);
router.post('/login',controller.login);
router.get('/users',roleMiddleware(['ADMIN','USER']),controller.getUsers)

module.exports = router;