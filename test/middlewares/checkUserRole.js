
module.exports = function checkUserRole ( role ){
  return async function (req, res, next) {
    if ( req.user.role === role ) next();
    else res.status(403).send('Forbidden');
  };
}