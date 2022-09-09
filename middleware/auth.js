module.exports = {
    ensureAuth: (req, res, next) => {
        console.log(req, req.session, req.isAuthenticated())
        if (req.isAuthenticated()){
            return next();
        }
        else{
            res.redirect('/');
        }
    },
    ensureGuest: (req, res, next) => {
        console.log(req, req.session, req.isAuthenticated())
        if (req.isAuthenticated()){
            res.redirect('/dashboard');
        }
        else{
            return next();
        }
    }
};