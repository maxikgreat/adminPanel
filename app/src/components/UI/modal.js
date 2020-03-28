//
// import React from "react";
// import {Modal} from 'react-bootstrap'
//
// const ModalCustom = ({modal, setModalVisible, headText, bodyText, acceptAction}) => {
//     return(
//         <Modal show={modal} onHide={() => setModalVisible(false)}>
//             <Modal.Header closeButton>
//                 <Modal.Title>{headText}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>{bodyText}</Modal.Body>
//             <Modal.Footer>
//                 <button
//                     type="button"
//                     className="btn btn-danger"
//                     onClick = {() => setModalVisible(false)}
//                 >Cancel</button>
//                 <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick = {() => {
//                         acceptAction();
//                         setModalVisible(false)
//                     }}
//                 >Accept</button>
//             </Modal.Footer>
//         </Modal>
//     )
// };
//
// export default ModalCustom
//
// // export default function openModalWithOptions(options){
// //         return (
// //             <ModalCustom
// //                 modal={options.modal}
// //                 setModalVisible={options.setModalVisible}
// //                 headText={options.headText}
// //                 bodyText={options.bodyText}
// //                 acceptAction={options.acceptAction}
// //             />
// //         )
// // }
