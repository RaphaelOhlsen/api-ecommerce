import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CategoriaSchema = Schema({
  nome: { type: String, required: true },
  codigo: { type: String, required: true },
  disponibilidade: { type: Boolean, default: true },
  produtos: { type: [{ type: Schema.Types.ObjectId, ref: 'Produto'}] },
  loja: { type: [{ type: Schema.Types.ObjectId, ref: 'Loja'}] }
},{ timestamps: true});

export default mongoose.model('Categoria', CategoriaSchema);