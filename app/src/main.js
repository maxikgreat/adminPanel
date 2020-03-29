import React from 'react'
import ReactDOM from 'react-dom'
import Admin from "./components/admin/admin"
import {ModalState} from './context/modal/modalState'

const app =
    <ModalState>
        <Admin />
    </ModalState>

ReactDOM.render(app, document.getElementById('root'));
