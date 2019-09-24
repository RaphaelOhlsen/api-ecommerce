import mongoose from 'mongoose';
import { promises } from 'dns';

const Pedido = mongoose.model('Pedido');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');
const Pagamento = mongoose.model('Pagamento');
const Entrega = mongoose.model('Entrega');
const Cliente = mongoose.model('Cliente');

// const CarrinhoValidation = require('./validacoes.carrinhoValidation');

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

  //CLIENTE

  // get / --- index
  async index(req,res,next){
    const { offset, limit, loja} = req.query;
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      const pedidos = await Pedido.paginate(
        { loja, cliente: cliente._id }, 
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

  // get /:id --- show
  async show(req,res,next){
    const _id  = req.params.id;
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      if(!cliente) return res.status(400).send({ error: 'Cliente não encontrado'});
      const pedido = await Pedido
        .findOne({ _id, cliente: cliente._id })
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

  // post / --- store
  async store(req,res,next){
    const { carrinho, pagamento, entrega } = req.body;
    const { loja } = req.query;
    try {

      //CHECAR DADOS DO CARRINHO
      // if(!await CarrinhoValidation(carrinho)) 
      //   return res.status(422).send({error: "Carrinho Inválido"});

      //CHECAR DADOS DA ENTREGA
      // if(!EntregaValidation(carrinho, entrega)) 
      //   return res.status(422).send({error: "Dados de Entrega Inválidos"});

      //CHECAR DADOS DE PAGAMENTO
      // if(!PagamentoValidation(carrinho, pagamento)) 
      //   return res.status(422).send({error: "Dados de Pagamento  Inválidos"});

      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      
      const NovoPagamento = new Pagamento({
        valor: pagamento.valor,
        forma: pagamento.forma,
        status: "iniciando",
        payload: pagamento,
        loja
      });

      const novaEntrega = new Entrega ({
        status: "nao_iniciado",
        custo: entrega.custo,
        prazo: entrega.prazo,
        payload: entrega,
        loja
      });

      const pedido = new Pedido({
        cliente: cliente._id,
        carrinho,
        pagamento: NovoPagamento._id,
        entrega: novaEntrega._id,
        loja
      });

      NovoPagamento.pedido = pedido._id;
      novaEntrega.pedido = pedido._id;

      await pedido.save();
      await novoPagamento.save();
      await novaEntrega.save();

      // Notificar via email para o cliente e o admin sobre novo pedido

      return res.send(
        { pedido: Object.assign(
            {},
            pedido,
            { entrega: novaEntrega, pagamento: novoPagamento, cliente }
          ) 
        }
      );

    } catch(e) {
        next(e);
    }
  }



  //delete /:id  remove
  async remove(req,res,next){
    const _id  = req.params.id;
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      if(!cliente) return res.status(400).send({ error: 'Cliente não encontrado'});
      const pedido = await Pedido.findOne({ cliente: cliente._id, _id });
      if(!pedido) return res.status(400).send({ error: 'Pedido não encontrado'});
      pedido.cancelado = true;

      // Registro de ativade = pedido cancelado
      // Enviar email para cliente de pedido cancelado

      await pedido.save();

      return res.send({ cancelado: true });
    } catch(e) {
        next(e);
    }
  }

  // get /:id/carrinho showCarrinhoPedido
  async showCarrinhoPedido(req,res,next){
    const _id  = req.params.id;
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      const pedido = await Pedido.findOne({ cliente: cliente._id, _id });
      
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