
module.exports =
function canOrderProceedTo (wantStatus) {
  return function ( req, res, next ){
    switch ( wantStatus ){
      case 'placed':
        if ( req.order.status === 'basket' ) return next();
        return res.status(403).send('Forbidden');
      case 'in-process':
        if ( req.order.status === 'placed' ) return next();
        return res.status(403).send('Forbidden');
      case 'sent':
        if ( req.order.status === 'in-process' ) return next();
        return res.status(403).send('Forbidden');
      case 'delivered':
        if ( req.order.status === 'sent' ) return next();
        return res.status(403).send('Forbidden');
      case 'cancelled':
        if ( req.user.role === 'owner' ) return next();
        return res.status(403).send('Forbidden');
      default:
        return res.status(403).send('Forbidden');
    }
  }
};
