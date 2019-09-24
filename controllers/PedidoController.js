import mongoose from 'mongoose';
import { promises } from 'dns';

const Pedido = mongoose.model('Pedido');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');
const Pagamento = mongoose.model('Pagamento');
const Entrega = mongoose.model('Entrega');
const Cliente = mongoose.model('Cliente');
const Usuario = mongoose.model('Usuario');

const CarrinhoValidation = require('./validacoes.carrinhoValidation');

class PedidoController {

  //ADMIN
  // get /admin  indexAdmin
  async indexAdmin(req,res,next){
    const { offset, limit, loja} = req.query;
    try {
      const pedidos = await Pedido.paginate(
        { loja }, 
        { offset: Number(offset || 0), 
          limit: Number(limit || 30), 
          populate: ['cliente', 'pagamento', 'entrega']
        }
      );
      
      pedidos.docs = await Promise.all( pedidos.docs.map( async pedido => {
        pedido.carrinho = await promises.all( pedido.carrinho.map(async item => {
          item.produto = await Produto.findById(item.produto);
          item.variacao = await Variacao.findById(item.variacao);
          return item;
        }))
        return pedido;
      }));

      return res.send({ pedidos });

    } catch(e) {
        next(e);
    }
  }

  //get /admin/:id   showAdmin
  async showAdmin(req,res,next){
    const { loja } = req.query
    const _id  = req.params.id;
    try {
      const pedido = await Pedido
        .findOne({ loja, _id })
        .populate([cliente, pagamento, entrega]);
      
      pedido.carrinho = await Promise.all( pedido.carrinho.map( async item => {
        item.produto = await Produto.findById(item.produto);
        item.variacao = await Variacao.findById(item.variacao);
        return item;
      }));
      return res.send({ pedido });
    } catch(e) {
        next(e);
    }
  }

  // delete /admin/:id removeAdmin
  async removeAdmin(req,res,next){
    const { loja } = req.query
    const _id  = req.params.id;
    try {
      const pedido = await Pedido.findOne({ loja, _id });
      if(!pedido) return res.status(400).send({ error: 'Pedido não encontrado'});
      pedido.cancelado = true;

      // Registro de ativade = pedido cancelado
      // Enviar email para cliente e admin de pedido cancelado

      await pedido.save();

      return res.send({ cancelado: true });
    } catch(e) {
        next(e);
    }
  }

  // get /admin/:id/carrinho showCarrinhoPedidoAdmin
  async showCarrinhoPedidoAdmin(req,res,next){
    const { loja } = req.query
    const _id  = req.params.id;
    try {
      const pedido = await Pedido.findOne({ loja, _id });
      
      pedido.carrinho = await Promise.all( pedido.carrinho.map( async item => {
        item.produto = await Produto.findById(item.produto);
        item.variacao = await Variacao.findById(item.variacao);
        return item;
      }));

      return res.send({ carrinho: pedido.carrinho });
    } catch(e) {
        next(e);
    }
  }



}

module.exports = PedidoController;