const tranpsorter = require('nodemailer').createTransport(require('../config/email'));
const { loja: link} = require('../config/index');
const moment = require('moment');

const _send = ({ subject, emails, message }, cb = mull) => {
  const mailOptions = {
    from: "no-response@lojati.com",
    to: emails,
    subject,
    html: message
  };
  if ( process.env.NODE_ENV  === "production"){
    tranpsorter.sendMail(mailOptions, function(error, info){
      if(error){
        console.warn(error);
        if(cb) return cb(error);
      } else {
        if(cb) return cb(null, true); 
      }
    });
  } else {
    console.log(mailOptions);
    if(cb) return cb(null, true);
  }
};

// NOVO PEDIDO
const enviarNovoPedido = ({ usuario, pedido }) => {
  const message = `
    <h1 style="text-align:center">Pedido Recebido</h1>
    <br />
    <p> O pedido realizado hoje, no dia ${momnet(pedido.createdAt).format('DD/MM/YYYY')}, foi recebido com sucesso.</p>
    <br />
    <a href="${loja}">Acesse a loja para saber mais.</a>
    <p>Atenciosamente,</p>
    <p>Equipe - Loja TI</p>
  `;
  _send({
    subject: "Pedido Recebido - Loja TI",
    emails: usuario.email,
    message
  })
};

// PEDIDO CANCELADO
const cancelarPedido = ({ usuario, pedido }) => {
  const message = `
    <h1 style="text-align:center">Pedido Cancelado</h1>
    <br />
    <p> O pedido realizado no dia ${momnet(pedido.createdAt).format('DD/MM/YYYY')} foi cancelado.</p>
    <br />
    <a href="${loja}">Acesse a loja para saber mais.</a>
    <p>Atenciosamente,</p>
    <p>Equipe - Loja TI</p>
  `;
  _send({
    subject: "Pedido Cancelado - Loja TI",
    emails: usuario.email,
    message
  })
};

// ATUALIZAÇÃO DE PAGAMENTO E ENTREGA
const atualizarPedido = ({ ususario, pedido, status, data, tipo }) => {
  const message = `
    <h1 style="text-align:center">Pedido Atualizado</h1>
    <br />
    <p> O pedido realizado no dia ${momnet(pedido.createdAt).format('DD/MM/YYYY')} sofreu uma atualização.</p>
    <br />
    <p>Nova Atualização: ${status} - realizado em ${moment(data).format('DD/MM/YYYY HH:mm')}</p>
    <a href="${loja}">Acesse a loja para saber mais.</a>
    <p>Atenciosamente,</p>
    <p>Equipe - Loja TI</p>
  `;
  _send({
    subject: "Pedido Atualizado - Loja TI",
    emails: ususario.email,
    message
  })
};

module.exports = { 
  enviarNovoPedido,
  cancelarPedido, 
  atualizarPedido 
};