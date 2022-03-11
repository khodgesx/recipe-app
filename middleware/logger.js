module.exports = (req, res, next)=>{
    console.log(`This request is at ${req.url}`)
    next()
}