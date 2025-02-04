const jwt = require("jsonwebtoken");
const {secret} = require("../config");
module.exports = (roles) => {
    return function(req, res, next) {
        if(req.method === 'OPTIONS') {
            next()
        }

        try {
            const token  = req.headers.authorization.split(' ')[1];
            if(!token){
                res.status(403).json({message: "user unauthorized"})
            }
            const {roles:userRoles} = jwt.verify(token, secret);
            let hasRole = false;
            userRoles.forEach((role) => {
                if(roles.includes(role)){
                    hasRole = true;
                }
            })
            if(!hasRole){
                res.status(403).json({message: "you dont have permission"})
            }
            next()
        }catch(err) {
            res.status(403).json({message: "user unauthorized"})
        }
    }
}