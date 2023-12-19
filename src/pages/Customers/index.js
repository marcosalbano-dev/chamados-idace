import { useState } from "react";
import Header from "../../components/header";
import Title from "../../components/Title";

import { FiUser } from "react-icons/fi";

import { db } from "../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Customers() {
  const [setor, setSetor] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");

  async function handleRegister(e){
    e.preventDefault();
    
    if(setor !== '' && nomeCliente !== ''){
        await addDoc(collection(db, "customers"), {
            setor: setor,
            nomeCliente: nomeCliente,
        })
        .then(() => {
        setSetor('');
        setNomeCliente('')
        toast.success("Cliente registrado")
        })
        .catch((error) => {
            console.log(error)
            toast.error("Erro ao fazer o cadastro.")
        }) 
    } else {
        toast.error("Preeencha todos os campos.")
    }
  }

  function handleChangeSetor(e) {
    setSetor(e.target.value);
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
          <label>Setor</label>
          <select value={setor} onChange={handleChangeSetor}>
              <option value="">Escolha o setor</option>
              <option value="Arquivo">ARQUIVO</option>
              <option value="Atendimento Nugef">ATENDIMENTO NUGEF</option>
              <option value="Atendimento">ATENDIMENTO</option>
              <option value="Campo">CAMPO</option>
              <option value="Diteo">DITEO</option>
              <option value="Diterd">DITERD</option>
              <option value="Empresa">EMPRESA</option>
              <option value="Nudef">NUDEF</option>
              <option value="Nugef">NUGEF</option>
              <option value="Nugeo">NUGEO</option>
              <option value="Super">SUPER</option>
              <option value="Titulacao">TITULAÇÃO</option>
              <option value="Unigep">UNIGEP</option>
              <option value="Uniti">UNITI</option>
            </select>
            <label>Cliente</label>
            <input
              type="text"
              placeholder="Digite o nome do cliente"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
            />
            <button type="submit">
                Salvar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
