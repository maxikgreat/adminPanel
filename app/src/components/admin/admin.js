
import React, {useState, useEffect, useRef, useContext} from 'react'
import axios from 'axios';
import '../../helpers/iframeLoader.js'
import DOMHelper from "../../helpers/domHelper";
import TextEditor from "../textEditor/textEditor";
//context
import {ModalContext} from "../../context/modal/modalContext";
import {AlertContext} from "../../context/alert/alertContext";
import {LoaderContext} from "../../context/loader/loaderContext";
//UI
import ModalCustom from "../UI/modal";
import AlertCustom from "../UI/alert";
import Loader from "../UI/loader";

const Admin = () => {

    //context UI elements
    const {modalShow} = useContext(ModalContext);
    const {alertShow} = useContext(AlertContext);
    const {loaderShow, loaderHide, loader} = useContext(LoaderContext);

    const _virtualDom = useRef(null);
    const _workFrame = useRef(null);

    const [currentPage, setCurrentPage] = useState("index.html");
    const [pageState, setPageState] = useState({
        pageList: [],
        backupsList: [],
        newPageName: ""
    });

    useEffect(() => {
        init(null, currentPage);
    }, [currentPage]);

    const init = (e, page) => {
        if(e){
            e.preventDefault();
        }
        //const frame = document.querySelector("iframe");
        open(page, _workFrame);
        loadPageList();
        loadBackupsList();
    };

    const open = (page) => {
        loaderShow()
        setCurrentPage(page);

        axios.get(`../${page}?rnd=${Math.random()}`) //get pure page.html without js and others scripts
            .then(res =>(DOMHelper.parseStrToDOM(res.data))) // convert string to dom structure
            .then(DOMHelper.wrapTextNodes) //wrap all text nodes with custom tags to editing
            .then(dom => {
                _virtualDom.current = dom; // SAVE PURE DOM STRUCTURE
                return dom
            })
            .then(DOMHelper.serializeDOMToString) //DOM -> STRING
            .then(html => axios.post('./api/saveTempPage.php', {html})) // create temp dirty page
            .then(() => _workFrame.current.load('../iwoc3fh38_09fksd.html')) //load dirty version to iframe
            .then(() => axios.post('./api/deleteTempPage.php'))
            .then(() => enableEditing()) //enable editing
            .then(() => injectStyles()) //styles when editing
            .then(() => loaderHide())
        loadBackupsList();

    };

    //edition functions
    const enableEditing = () => {
        _workFrame.current.contentDocument.body.querySelectorAll("text-editor").forEach(element => {
            const id = element.getAttribute("nodeid");
            //write changes from dirty copy to pure
            const virtualElement = _virtualDom.current.body.querySelector(`[nodeid="${id}"]`);
            new TextEditor(element, virtualElement)
        });
    };

    const injectStyles = () => {
        const style = document.querySelector("iframe").contentDocument.createElement("style");
        style.innerHTML = `
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
            text-editor:focus {
                outline: 3px solid red;
                outline-offset: 8px;
            }
        `;
        document.querySelector("iframe").contentDocument.head.appendChild(style);
    };

    const savePage = async () => {
        loaderShow();
        const newDom = _virtualDom.current.cloneNode(_virtualDom.current);
        DOMHelper.unWrappedTextNodes(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        try{
            await axios.post("./api/savePage.php", {
                "pageName": currentPage,
                html
            })
            alertShow('success', 'Success!', 'Your changes was saved')
        } catch (e) {
            alertShow('danger', 'Error!', 'Some error')
        }
        loaderHide();
        loadBackupsList();
    };

    const loadBackupsList = async () => {
             await axios.get('./backups/backups.json')
                .then((response) => {
                    setPageState(pageState => {return{
                        ...pageState,
                        backupsList: response.data.filter(backup => {
                            return backup.page === currentPage
                        })
                    }})
                })
                 .catch(() => {
                     alertShow("warning", "Warning!", "Backup file not exists yet")
                 })
    }

    const restoreBackup = (e, backup) => {
        if(e){
            e.preventDefault();
        }
        axios.post("./api/restoreBackup.php", {
            "page": currentPage,
            "file": backup
        }).then(() => {
            open(currentPage)
            alertShow("success", 'Success!', 'Restored from backup')
        })
    }

    //pages functions
    const loadPageList = async () => {
        try{
            const response = await axios.get('./api/pageList.php');
            setPageState(pageState => {return{
                ...pageState,
                pageList: response.data
            }})
        }
        catch(e){
            console.log(e.message)
        }
    };

    const renderPages = () => {
        return pageState.pageList.map((page, index) => {
            return <h1
                key={index}
            >{page}
            <a
                href='#'
                onClick={() => {deletePage(page)}}
            >(x)</a>
            </h1>
        })
    };

    return(
        <>
            <nav className="navbar">
                <div className="col-2">

                </div>
                <div className="col-6">
                    <AlertCustom />
                </div>
                <div className="col-4">
                    <button
                        type="button"
                        className="btn btn-primary ml-3"
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
                        className="btn btn-primary ml-3"
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
                        className="btn btn-danger ml-3"
                        onClick = {() => modalShow(
                            "list",
                            "Chose backup",
                            pageState.backupsList,
                            restoreBackup
                        )}
                    >Backup
                    </button>
                </div>
            </nav>
            <iframe src = '' frameBorder="0" ref = {_workFrame}></iframe>  {/*from folder admin > main folder where located index.html*/}
            <ModalCustom />
            {loader.isVisible ? <Loader/> : null}
        </>
    )
};

export default Admin
