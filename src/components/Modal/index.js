import './modal.css'
import { FiX } from 'react-icons/fi'

export default function Modal(){
    return(
        <div className='modal'>
            <div className='container'>
                <button className='close'>
                    <FiX size={25} color='#FFF' />
                    Voltar
                </button>

                <main>
                    <h2>Detalhes do chamado</h2>
                    <div className='row'>
                        <span>
                            Cliente: <i>Fulano</i>
                        </span>
                    </div>                    
                </main>
            </div>
        </div>
    )
}