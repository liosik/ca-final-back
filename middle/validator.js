const userSchema = require("../schemas/userSchema");
const threadSchema = require("../schemas/threadSchema")


module.exports = {
    validateRegister: async (req, res, next) => {
        const {username, pw1, pw2} = req.body
        const users = await userSchema.find()
        const user = users.find(x => username === x.username)
        if (user) res.send({success: false, errorMessage: "USER ALREADY REGISTERED"})
        if (!username) return res.send({success: false, errorMessage: "USERNAME NOT VALID"})
        if (pw1 !== pw2) return res.send({success: false, errorMessage: "PASSWORDS DON'T MATCH"})
        next()
    },
    validateLogin: async (req, res, next) => {
        const {username, pw1} = req.body
        const users = await userSchema.find()
        const user = users.find(x => username === x.username)
        if (!user) return res.send({success: false, errorMessage: "USER NOT REGISTERED"})
        if (!username) return res.send({success: false, errorMessage: "EMAIL NOT VALID"})
        if (pw1.length < 0 && pw1.length > 20) return res.send({success: false, errorMessage: "PASSWORD NOT VALID"})
        next()
    },
    validateThread: async (req, res, next) => {
        const {name, user, comments} = req.body
        const threads = await threadSchema.find()
        const thread = threads.find(x => name === x.name)
        if (name.length > 20) return res.send({success: false, errorMessage: "THREAD NAME IS TOO LONG"})
        if (thread) return res.send({success: false, errorMessage: "THREAD WITH THAT NAME ALREADY EXISTS"})
        if (!user) return res.send({success: false, errorMessage: "USER NOT LOGGED IN"})
        if (comments.length > 0) return ({success:false, errorMessage: "SOMETHING WENT WRONG"})
        next()
    },
    validatePictureChange: async (req, res, next) => {
        const {newPicture} = req.body
        if (!(newPicture.includes("http"))) return res.send({success: false, errorMessage: "CHECK PICTURE URL"})
        next()
    },
    validateComment: async (req, res, next) => {
        const {comment, user} = req.body
        if(comment.length > 100) return res.send({success: false, errorMessage: "COMMENT IS TOO LONG"})
        if(comment.length === 0) return res.send({success: false, errorMessage: "COMMENT IS TOO SHORT"})
        if(!user) return res.send({success: false, errorMessage: "PLEASE LOG IN"})
        next()

    }

}
