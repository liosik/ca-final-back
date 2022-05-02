const {v4: uuid} = require("uuid")
const userSchema = require("../schemas/userSchema")
const threadSchema = require("../schemas/threadSchema")


module.exports = {
    register: (req, res) => {
        const {username, pw1} = req.body
        const user = new userSchema()
        user.username = username
        user.password = pw1
        user.picture = 'https://www.kindpng.com/picc/m/80-800188_random-user-random-icon-png-transparent-png.png'
        user.secret = uuid()
        console.log(req.session)
        user.save().then(() => {
            console.log(`User ${username} registered`)
        })
        res.send({success: true})
    },
    login: async (req, res) => {
        const {username, stayLogged} = req.body
        const users = await userSchema.find()
        const user = users.find(x => username === x.username)

        if (user) {
            console.log(`User ${username} Logged in`)
            stayLogged ? req.session.username = username : req.session.username = null
            const threads = await threadSchema.find()
            return res.send({success: true, user, threads})
        } else {
            res.send({success: false, errorMessage: "BAD CREDENTIALS"})
        }
    },
    check: async (req, res) => {
        const {userSecret} = req.body
        const users = await userSchema.find()
        const user = users.find(x => userSecret === x.secret)
        const threads = await threadSchema.find()

        if (user) {
            res.send({success: true, user, threads})
        } else {
            res.send({success: false, threads, errorMessage: "PLEASE LOG IN"})
        }
    },
    addThread: async (req, res) => {
        const {name, user, comments} = req.body
        const thread = new threadSchema()
        thread.name = name
        thread.user = user
        thread.comments = comments
        thread.save().then(() => {
            console.log(`${user.username} added thread:${name}`)
        })
        const threads = await threadSchema.find()
        console.log(threads)
        res.send({success: true, threads})
    },
    changePicture: async (req, res) => {
        const {newPicture, userSecret} = req.body
        await userSchema.updateOne(
            {userSecret: userSecret},
            {picture: `${newPicture}`},
        )
        const user = await userSchema.findOne({userSecret})
        res.send({success: true, user})
    },
    addComment: async (req, res) => {
        const{id, comment, user} = req.body
        const currentThread = await threadSchema.findOne({_id: id})
        const newComment = {
            comment,
            user
        }
        await threadSchema.updateOne(
            {_id: id},
            {comments: [...currentThread.comments, newComment]}
        )
        console.log(`${user.username} commented on ${currentThread.name}`)
        const threads = await threadSchema.find()
        res.send({success: true, threads})
    }
}