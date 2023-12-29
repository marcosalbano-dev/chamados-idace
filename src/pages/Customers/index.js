import { useState } from "react";
import Header from "../../components/Header";
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
          <option value="">Escolha o setor...</option>
              <option value="Adins">Adins - Assesoria de Desenvolvimento Institucional</option>
              <option value="Assejur">Assejur - Assessoria Jurídica</option>
              <option value="Diaf">Diaf - Diretoria Administrativo-Financeira</option>
              <option value="Diteo">Diteo - Diretoria Técnica e de Operações</option>
              <option value="Gead">Gead - Gerência de Administração</option>
              <option value="Gedef">Gedef - Gerência de Desenvolvimento Fundiário</option>
              <option value="Gefic">Gefic - Gerência de Gestão Financeira e Contábil</option>
              <option value="Gegef">Gegef - Gerência de Gestão Fundiária</option>
              <option value="Gegeo">Gegeo - Gerência de Cartografia, Geoprocessamento e Diagnóstico Fundiário</option>
              <option value="Necaf">Necaf - Núcleo Estudos, Cadastro e Levantamento Fundiário</option>
              <option value="Nuart">Nuart - Núcleo de Apoio a Assentamentos, Reassentamentos Rurais e Acesso a Terra</option>
              <option value="Nupaf">Nupaf - Núcleo de Titulação e Patrimônio Fundiário</option>
              <option value="Nugep">Nugep - Núcleo de Gestão de Pessoas</option>
              <option value="Ouvid">Ouvidoria</option>
              <option value="Super">Super - Superintendência</option>
              <option value="Supad">Supad - Superintendência Adjunta</option>
              <option value="Uniti">Uniti - Unidade de Tecnologia da Informação</option>
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
