export const isAdmin = (req, res, next) => {
    if(!req.user || req.user.role !== "ADMIN"){
        return res.status(404).json({
            status : false ,
            message : "Admin access only"
        });
    }
    next();
}
