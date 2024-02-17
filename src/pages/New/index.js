import { useState, useEffect, useContext, useRef } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlusCircle } from "react-icons/fi";

import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

import "./new.css";

const listRef = collection(db, "customers");

export default function New() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate()

  const [customers, setCustomers] = useState([]);
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [complemento, setComplemento] = useState("");
  const [setor, setSetor] = useState("Nugeo");
  const [assunto, setAssunto] = useState("Suporte");
  const [status, setStatus] = useState("Aberto");
  const [idCustomer, setIdCustomer] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeCliente: doc.data().nomeCliente,
            });
          });

          if (snapshot.docs.size === 0) {
            console.log("NENHUM CLIENTE ENCONTRADO");
            setCustomers([{ id: "1", nomeCliente: "TESTE" }]);
            setLoadCustomer(false);
            return;
          }

          setCustomers(lista);
          setLoadCustomer(false);

          if (id) {
            loadId(lista)
          }
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS CLIENTES", error);
          setLoadCustomer(false);
          setCustomers([{ id: "1", nomeCliente: "TESTE" }]);
        });
    }

    loadCustomers();
  }, [id]);

  async function loadId(lista) {
    const docRef = doc(db, "chamados", id)
    await getDoc(docRef)
      .then((snapshot) => {
        setSetor(snapshot.data().setor)
        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento)

        let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
        setCustomerSelected(index)
        setIdCustomer(true)

      })
      .catch((error) => {
        console.log(error)
        setIdCustomer(false)
      })
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  function handleChangeSetor(e) {
    setSetor(e.target.value);
  }

  function handleChangeCustomer(e) {
    setCustomerSelected(e.target.value);
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomer) {
      //Atualizando chamado
      const docRef = doc(db, "chamados", id)
      await updateDoc(docRef, {
        cliente: customers[customerSelected].nomeCliente,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
        setor: setor,
      })
        .then(() => {
          
          toast.info("Chamado atualizado com sucesso!")
          setCustomerSelected(0)
          setComplemento('')
          navigate('/dashboard')
        })
        .catch((error) => {
          toast.error("Ops, erro ao atualizar esse chamado!")
        })
        
      return;
      
    }

    //registrar um chamado
    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: customers[customerSelected].nomeCliente,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid,
      setor: setor,
    })
      .then(() => {
        toast.success("Chamado registrado");
        setComplemento("");
        setCustomerSelected(0);
      })
      .catch((error) => {
        toast.error("Ops! Erro ao resistrar, tente mais tarde");
      });
      // console.log(user.nome)
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name={id ? "Editando Chamado" : "Novo chamado"}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Clientes</label>
            {loadCustomer ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomer}>
                {customers.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {[item.nomeCliente, item.userNome]}
                    </option>
                  );
                })}
              </select>
            )}

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

            <label>Serviço</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="">Escolha o serviço...</option>
              <option value="Serviço no SIGA">Serviço no SIGA</option>
              <option value="Serviço no TITULA">Serviço no TITULA</option>
              <option value="Serviço no BANCO DE DADOS">Serviço no BANCO DE DADOS</option>
              <option value="Serviço no EMAIL">Serviço no EMAIL</option>
              <option value="Serviço na REDE">Serviço na REDE</option>
              <option value="Relatórios Gerenciais">Relatórios Gerenciais</option>
              <option value="Manutenção e Suporte">Manutenção e Suporte</option>
              <option value="Inserir dados da Empresa Topodatum">Inserir dados da Empresa Topodatum</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              />
              <span>Em aberto</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === "Progresso"}
              />
              <span>Em Progresso</span>

              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === "Atendido"}
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
