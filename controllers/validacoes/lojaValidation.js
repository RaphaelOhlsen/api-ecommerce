const mongoose = require('mongoose');

const Usuario = mongoose.model('Usuario');
const Loja = mongoose.model('Loja');

modules.exporet = (req,res,next) => {
  if(!req.payload.id) {
    return res.sendStatus(401);
  }
  const { loja } = req.query;
  if(!loja) {
    return res.sendStatus(401);
  }
  Usuario.findById(req.payload.id).then(usuario => {
    if(!usuario) {
      return res.sendStatus(401);
    }
    if(!usuario.loja) {
      return res.sendStatus(401);
    }
    if(!usuario.premissao.includes('admin')) {
      return res.sendStatus(401);
    }
    if(usuario.loja !== loja) {
      return res.sendStatus(401);
    }
    next();
  }).catch(next);
}