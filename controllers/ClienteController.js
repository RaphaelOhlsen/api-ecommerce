import mongoose from 'mongoose';

const Cliente = mongoose.model('Cliente');
const Usuario = mongoose.model('Usuario');

class ClienteController {

  // GET / index
  async index(req,res,next){
    const offset = Number(req.query.offset) || 0;
    const limit = Nember(req.query.limit || 30);
    try {
      const clientes = await Cliente.paginate(
        { loja: req.query.loja },
        { offset, limit, populate: 'usuario'}
      );
      return res.send({ clientes })
    } catch(e){
      next(e);
    }
  }

  //GET /search/:search/pedidos
  searchPedidos(req,res,next){
    return res.status(400).send({ error: 'Em desenvolvimento' });
  }

  // GET /search/:search
  async search(req,res,next){
    const offset = Number(req.query.offset) || 0;
    const limit = Nember(req.query.limit || 30);
    const search = new RegExp(req.params.search, "i");
    try {
      const clientes = await Cliente.paginate(
        { loja: req.query.loja, nome: { $regex: search } },
        { offset, limit, populate: 'usuario'}
      );
      return res.send({ clientes })
    } catch(e){
      next(e);
    }
  }

  // GET /admin:id
  async showAdmin(req,res,next){
    try {
      const cliente = await Cliente
      .findOne({_id: req.params.id, loja: req.query.loja }).populate('usuario');
      return res.send({ cliente});
    } catch(e){
      next(e);
    }
  }
}

export default ClienteController;