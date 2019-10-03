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

};

// PEDIDO CANCELADO
const cancelarPedido = ({ usuario, pedido }) => {

};

// ATUALIZAÇÃO DE PAGAMENTO E ENTREGA
const atualizarPedido = ({ ususario, pedido, status, data, tipo }) => {

};

module.exports = { 
  enviarNovoPedido,
  cancelarPedido, 
  atualizarPedido 
};