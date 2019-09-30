import BaseJoi from 'joi';
import Extension from 'joi-date-extensions';
const Joi = BaseJoi.extend(Extension);

const PedidoValidation = {
  indexAdmin: {
    query: {
      offset: Joi.number(),
      limit: Joi.number(),
      loja: Joi.string().alphanum().length(24).required(),
    }
  },
  showAdmin: {
    query: { 
      loja: Joi.string().alphanum().length(24).required()
    },
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  removeAdmin: {
    query: { 
      loja: Joi.string().alphanum().length(24).required()
    },
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  showCarrinhoPedidoAdmin: {
    query: { 
      loja: Joi.string().alphanum().length(24).required()
    },
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  index: {
    query: {
      offset: Joi.number(),
      limit: Joi.number(),
      loja: Joi.string().alphanum().length(24).required(),
    }
  },
  show: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  remove: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  showCarrinhoPedido: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  store: {
    body: {
      carrinho: Joi.array().items(Joi.object({
        produto: Joi.string().alphanum().length(24).required(),
        variacao: Joi.string().alphanum().length(24).required(),
        precoUnitario: Joi.number().required(),
        quantidade: Joi.number().required()
      })).required(),
      pagamento: Joi.object({
        valor: Joi.number().required(),
        forma: Joi.string().required(),
        parcelas: Joi.string().required(),
        enderecoEntregaIgualCobranca: Joi.boolean().required(),
        endereco: Joi.object({
          local: Joi.number().required(),
          numero: Joi.number().required(),
          complemento: Joi.number().optional(),
          bairro: Joi.number().required(),
          cidade: Joi.number().required(),
          estado: Joi.number().required(),
          CEP: Joi.number().required(),
        }).required(),
        cartao: Joi.object({
          nomeCompleto: Joi.string().required(),
          codigoArea: Joi.string().required(),
          telefone: Joi.string().required(),
          dataDeNascimento: Joi.date().format('DD/MM/YYYY').raw().required(),
          credit_card_token: Joi.string().required(),
          cpf: Joi.string().required(),
        }).optional()
      }).required(),
      entrega: Joi.object({
        custo: Joi.number().required(),
        tipo: Joi.string().required(),
        prazo: Joi.number().required(),
        endereco: Joi.object({
          local: Joi.number().required(),
          numero: Joi.number().required(),
          complemento: Joi.number().optional(),
          bairro: Joi.number().required(),
          cidade: Joi.number().required(),
          estado: Joi.number().required(),
          CEP: Joi.number().required(),
        }).required(),
      }).required(),
    },
    query: {
      loja: Joi.string().alphanum().length(24).required()
    }
  }

}

module.exports = { PedidoValidation };