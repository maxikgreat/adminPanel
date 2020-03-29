import React from 'react'
import ReactDOM from 'react-dom'
import Admin from "./components/admin/admin"
import {ModalState} from './context/modal/modalState'
import {AlertState} from './context/alert/alertState'

const app =

    <ModalState>
        <AlertState>
            <Admin />
        </AlertState>
    </ModalState>

ReactDOM.render(app, document.getElementById('root'));
