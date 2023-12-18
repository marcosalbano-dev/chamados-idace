import { useState, useEffect, useContext } from "react";
import Header from "../../components/header";
import Title from "../../components/Title";
import { FiPlusCircle } from "react-icons/fi";

import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, getDoc, doc, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import "./new.css";

const listRef = collection(db, "customers");

export default function New() {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [complemento, setComplemento] = useState("");
  const [setor, setSetor] = useState("Nugeo");
  const [assunto, setAssunto] = useState("Suporte");
  const [status, setStatus] = useState("Aberto");

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
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS CLIENTES", error);
          setLoadCustomer(false);
          setCustomers([{ id: "1", nomeCliente: "TESTE" }]);
        });
    }

    loadCustomers();
  }, []);

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
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Novo chamado">
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
                      {item.nomeCliente}
                    </option>
                  );
                })}
              </select>
            )}

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
              placeholder="Seu setor"
              value={setor}
              onChange={(e) => setSetor(e.target.value.toUpperCase())}
            /> */}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Desenvolvimento">Desenvolvimento</option>
              <option value="Outro">Outro</option>
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
              <span>Progresso</span>

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
