
import React, {useContext} from "react";
import {Modal} from 'react-bootstrap'
import {ModalContext} from "../../context/modal/modalContext";

const ModalCustom = () => {

    const {modal, modalHide} = useContext(ModalContext)

    return(
        <Modal show={modal.isVisible} onHide={modalHide}>
            <Modal.Header closeButton>
                <Modal.Title>{modal.headText}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modal.bodyText}</Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick = {modalHide}
                >Cancel</button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick = {() => {
                        modal.acceptAction();
                        modalHide();
                    }}
                >Accept</button>
            </Modal.Footer>
        </Modal>
    )

};

export default ModalCustom