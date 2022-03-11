module.exports = (req, res, next)=>{
    if(req.session.isLoggedIn){
        next()
    }else{
        res.redirect("/users/login")
    }
}