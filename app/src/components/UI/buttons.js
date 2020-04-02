
import React from 'react'

const Buttons = ({modalShow, savePage, pageState, init, _virtualDom, restoreBackup, logout}) => {
    return(
        <>
            <button
                type="button"
                className="btn btn-primary"
                onClick = {() => modalShow(
                    "text",
                    "Attention!",
                    "Do you really want to save changes?",
                    savePage
                )}
            >Save
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick = {() => modalShow(
                    "list",
                    "Chose page",
                    pageState.pageList,
                    init
                )}
            >Open
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick = {() => modalShow(
                    "edit-meta",
                    "Edit META-tags",
                    _virtualDom,
                    init
                )}
            >Change META
            </button>
            <button
                type="button"
                className="btn btn-danger"
                onClick = {() => modalShow(
                    "list",
                    "Chose backup",
                    pageState.backupsList,
                    restoreBackup
                )}
            >Backup
            </button>
            <button
                type="button"
                className="btn btn-danger"
                onClick = {() => modalShow(
                    "text",
                    "Log Out",
                    "Are you sure?",
                    logout
                )}
            >Log Out
            </button>
        </>
    )
};

export default Buttons