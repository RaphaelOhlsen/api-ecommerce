import mongoose from 'mongoose';
import { calcularFrete } from './integracoes/correios';

const Entrega = mongoose.model('Entrega');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');
const RegistroPedido = mongoose.model('RegistroPedido');


class EntregaConroller {

  // GET /:id ---show
  async show(req,res,next) {
    try {
      const entrega = await Entrega
        .findOne({ _id: req.params.id, loja: req.query.loja });

      const registros = await Registro
        .find({ pedido: entrega.pedido, tipo: 'entrega'});  

      return res.send({ entrega, registros });

    } catch(e) {
        next(e);
    } 
  }

  // PUT /:id --- update
  async update(req,res,next) {
    const { situacao, codigoRastreamento } = req.body;
    const { loja } = req.query;
    try {
      const entrega = await Entrega.findOne({_id: req.params.id, loja });
      if(situacao) entrega.situacao = situacao;
      if(codigoRastreamento) entrega.codigoRastreamento = codigoRastreamento; 

      const registroPedido = new RegistroPedido({
        pedido: entrega.pedido,
        tipo: "entrega",
        situacao, 
        payload: req.body
      });
      await registroPedido.save();
      // Enviar email de aviso para o cliente - aviso de atualização na entrega

      await entrega.save();
      return res.send({ entrega });
    } catch(e) {
        next(e);
    }
  }

  // POST /calcular --- calcular
  async calcular(req,res,next) {
    const { cep, carrinho} = req.body;
    try {
      const _carrinho = Promise.all( carrinho.map(async item => {
        item.produto = await Produto.findById(item.produto);
        item.variacao = await Variacao.findById(item.variacao); 
        return item;
      }));
      
      const resultados = await calcularFrete(cep, _carrinho);
      return res.send({ resultados });
    } catch(e) {
        next(e);
    }
  }
}

export default EntregaConroller;