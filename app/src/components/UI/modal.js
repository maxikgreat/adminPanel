
import React, {useContext} from "react";
import {Modal} from 'react-bootstrap'
import {ModalContext} from "../../context/modal/modalContext";
import MetaEditor from "../metaEditor/metaEditor";

const ModalCustom = () => {


    const {modal, modalHide} = useContext(ModalContext)

    const modalContentType = () => {
        if(modal.type === "text"){
            return modal.body
        } else if (modal.type === "list"){
            return(
                <div className="list-group">
                    {modal.body.map((item, index) => {
                        if(item.time){ //for backups
                            return <a
                                key = {item.file}
                                href = "#"
                                className="list-group-item list-group-item-action"
                                onClick = {(e) => {
                                    modal.acceptAction(e, item.file)
                                    modalHide()
                                }}
                            >Backup time: {item.time}</a>
                        } else {
                            return <a
                                key = {index}
                                href = "#"
                                className="list-group-item list-group-item-action"
                                onClick = {(e) => {
                                    modal.acceptAction(e, item)
                                    modalHide()
                                }}
                            >{item}</a>
                        }
                    })}
                </div>
            )
        }
    }

    const checkModalType = () => {
        if(modal.type !== 'edit-meta'){
            return(
                <>
                    <Modal.Body>
                        {
                                modal.body.length < 1 ? "Data not found!" : modalContentType()
                        }
                    </Modal.Body>
                    {
                        modal.type !== 'list'
                            ? <Modal.Footer>
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
                            </Modal.Footer> : null
                    }
                </>
            )
        } else {
            return(
                <MetaEditor
                    virtualDom={modal.body}
                    onClose = {modalHide}
                />
            )
        }
    }


    return(
        <Modal show={modal.isVisible} onHide={modalHide}>
            <Modal.Header closeButton>
                <Modal.Title>{modal.headText}</Modal.Title>
            </Modal.Header>
            {checkModalType()}
        </Modal>
    )
};

export default ModalCustom