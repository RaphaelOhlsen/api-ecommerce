import mongoose from 'mongoose';

const Pedido = mongoose.model('Pedido');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');
const Pagamento = mongoose.model('Pagamento');
const Entrega = mongoose.model('Entrega');
const Cliente = mongoose.model('Cliente');
const RegistroPedido = mongoose.model('RegistroPedido');

const { calcularFrete } = require('./integracoes/correios');
const EntregaValidation = require('./validacoes/entregaValidation');
const PagamentoValidation = require('./validacoes/pagamentoValidation');

const CarrinhoValidation = require('./validacoes/carrinhoValidation');

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
        pedido.carrinho = await Promise.all( pedido.carrinho.map(async item => {
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
        .populate(["cliente", "pagamento", "entrega"]);
      
      pedido.carrinho = await Promise.all( pedido.carrinho.map( async item => {
        item.produto = await Produto.findById(item.produto);
        item.variacao = await Variacao.findById(item.variacao);
        return item;
      }));
      const registros = await RegistroPedido.find({ pedido: pedido._id });
      return res.send({ pedido, registros });
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

      const registroPedido = new RegistroPedido({
        pedido: pedido._id,
        tipo: "pedido",
        situacao: "pedido_cancelado"
      });
      await registroPedido.save();

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
      if(!cliente) return res.status(400).send({ error: 'Cliente não encontrado'});
      const pedidos = await Pedido.paginate(
        { loja, cliente: cliente._id }, 
        { offset: Number(offset || 0), 
          limit: Number(limit || 30), 
          populate: ['cliente', 'pagamento', 'entrega']
        }
      );
      
      pedidos.docs = await Promise.all( pedidos.docs.map( async pedido => {
        pedido.carrinho = await Promise.all( pedido.carrinho.map(async item => {
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
        .populate(["cliente", "pagamento", "entrega"]);
      
      pedido.carrinho = await Promise.all( pedido.carrinho.map( async item => {
        item.produto = await Produto.findById(item.produto);
        item.variacao = await Variacao.findById(item.variacao);
        return item;
      }));
      const registros = await RegistroPedido.find({ pedido: pedido._id });

      return res.send({ pedido, registros });
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
      if(!await CarrinhoValidation(carrinho)) 
        return res.status(422).send({error: "Carrinho Inválido"});

      const cliente = await Cliente.findOne({ usuario: req.payload.id }).populate("usuario");

      //CHECAR DADOS DA ENTREGA
      if(!await EntregaValidation.checarValorPrazo(cliente.endereco.CEP, carrinho, entrega)) 
        return res.status(422).send({error: "Dados de Entrega Inválidos"});

      //CHECAR DADOS DE PAGAMENTO
      if(!await PagamentoValidation.checarValrTotal({ carrinho, pagamento, entrega })) 
        return res.status(422).send({error: "Dados de Pagamento Inválidos"});

      //CHECAR DADOS DE CARTAO
      if(PagamentoValidation.checarCartao({ pagamento })) 
        return res.status(422).send({error: "Dados de Pagamento com Cartão Inválidos"});
      
      const novoPagamento = new Pagamento({
        valor: pagamento.valor,
        parcelas: pagamento.parcelas || 1,
        forma: pagamento.forma,
        status: "iniciando",
        endereco: pagamento.endereco,
        cartao: pagamento.cartao,
        enderecoEntregaCobranca: pagamento.enderecoEntregaCobranca,
        loja
      });

      const novaEntrega = new Entrega ({
        status: "nao_iniciado",
        custo: entrega.custo,
        prazo: entrega.prazo,
        tipo: entrega.tipo,
        endereco: entrega.endereco,
        loja
      });

      const pedido = new Pedido({
        cliente: cliente._id,
        carrinho,
        pagamento: novoPagamento._id,
        entrega: novaEntrega._id,
        loja
      });

      novoPagamento.pedido = pedido._id;
      novaEntrega.pedido = pedido._id;

      await pedido.save();
      await novoPagamento.save();
      await novaEntrega.save();

      const registroPedido = new RegistroPedido({
        pedido: pedido._id,
        tipo: "pedido",
        situacao: "pedido_criado"
      });
      await registroPedido.save();

      // Notificar via email para o cliente e o admin sobre novo pedido

      return res.send(
        { pedido: Object.assign(
            {},
            pedido._doc,
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

      const registroPedido = new RegistroPedido({
        pedido: pedido._id,
        tipo: "pedido",
        situacao: "pedido_cancelado"
      });
      await registroPedido.save();

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