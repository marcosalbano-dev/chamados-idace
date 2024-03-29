import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  query,
  where,
  or,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from 'date-fns'
import Modal from '../../components/Modal'
import { doc, updateDoc } from "firebase/firestore";

import "./dashboard.css";

const listRef = collection(db, "chamados");

export default function Dashboard() {
  // const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadChamados() {
      const queryAbertos = query(listRef,  where("status", "in", ["Aberto", "Progresso"]), limit(20))
      // const q = query(listRef, orderBy("created", "desc"), limit(10));
      const querySnapshot = await getDocs(queryAbertos);
      setChamados([]);

      await updateState(querySnapshot);

      setLoading(false);
    }

    loadChamados();

    return () => {};
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/LL/yyyy HH:mm:ss'),
          status: doc.data().status,
          complemento: doc.data().complemento,
          setor: doc.data().setor,
          usuario: doc.data().userId
        });
      });
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

      setChamados((chamados) => [...chamados, ...lista]);
      setLastDocs(lastDoc)

    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false)
  }

  if (loading) {
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25}/>
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    );
  }

  async function handleMore(){
    setLoadingMore(true)

    const q = query(listRef, orderBy("created", "desc"), startAfter(lastDocs), limit(5));
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot)

  }

  function toggleModal(item){
    setShowPostModal(!showPostModal)
    setDetail(item)
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Chamados">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
              <table>
                <thead>
                  <tr>
                    {/* <th scope="col">Técnico</th> */}
                    <th scope="col">Usuário</th>
                    <th scope="col">Setor</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        {/* <td data-label="Usuario">{item.usuario.data}</td> */}
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Setor">{item.setor}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label='Status'>
                          {item.status ===
                            'Aberto' && (
                             <span className='badge badge-green'>
                              {item.status}
                             </span>
                          )}
                          {item.status ===
                            'Atendido' && (
                            <span className='badge badge-red'>
                             {item.status}
                            </span>
                          )}
                          {item.status ===
                            'Progresso' && (
                            <span className='badge badge-blue'>
                             {item.status}
                            </span>
                          )}
                          </td>
                        {/* <td data-label="Status">
                          <span
                            className="badge"
                            style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}
                          >
                            {item.status}
                          </span>
                        </td> */}
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="Ações">
                          <button
                            className="action"
                            style={{ backgroundColor: "#3583f6" }} onClick={ () => toggleModal(item) }>
                            <FiSearch color="#FFF" size={17} />
                          </button>

                          <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: "#f6a935" }}>
                            <FiEdit2 color="#FFF" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
               {loadingMore && <h3>Buscando mais chamados...</h3>} 
               {/* {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}> Buscar atendidos</button>}   */}
            </>
          )}
        </>
      </div>
      
        {showPostModal && (
          <Modal 
          conteudo={detail}
          close={() => setShowPostModal(!showPostModal)} />
        )}

    </div>
  );
}
