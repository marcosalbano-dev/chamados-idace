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
              <option value="Nugeo">Nugeo</option>
              <option value="Nugef">Nugef</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
            </select>
            {/* <label>Setor</label>
            <input
              type="text"
              placeholder="Nome do setor"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
            /> */}

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
