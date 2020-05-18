import React from 'react'
import ReactDOM from 'react-dom'
import Admin from "./components/admin/admin"
import '../scss/style.scss';
import {ModalState} from './context/modal/modalState'
import {AlertState} from './context/alert/alertState'
import {LoaderState} from "./context/loader/loaderState"

const app =
    <LoaderState>
        <ModalState>
            <AlertState>
                <Admin />
            </AlertState>
        </ModalState>
    </LoaderState>

ReactDOM.render(app, document.getElementById('root'));
