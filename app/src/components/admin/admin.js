
import React, {useState, useEffect, useRef, useContext} from 'react'
import axios from 'axios';
import '../../helpers/iframeLoader.js'
import DOMHelper from "../../helpers/domHelper";
import TextEditor from "../textEditor/textEditor";
import ImagesEditor from "../imagesEditor/imagesEditor";
import Login from "../login/login";
//context
import {ModalContext} from "../../context/modal/modalContext";
import {AlertContext} from "../../context/alert/alertContext";
import {LoaderContext} from "../../context/loader/loaderContext";
//UI
import ModalCustom from "../UI/modal";
import AlertCustom from "../UI/alert";
import Loader from "../UI/loader";
//hooks
import usePrevious from "../../customHooks/usePrevious";

const Admin = () => {

    //context UI elements
    const {modalShow} = useContext(ModalContext);
    const {alertShow} = useContext(AlertContext);
    const {loaderShow, loaderHide, loader} = useContext(LoaderContext);
    //refs
    const _virtualDom = useRef(null);
    const _workFrame = useRef(null);
    //state

    const [currentPage, setCurrentPage] = useState("index.html");
    const [auth, setAuth] = useState(false);
    const [passError, setPassError] = useState('');
    const [pageState, setPageState] = useState({
        pageList: [],
        backupsList: [],
        newPageName: "",
    });

    const prevAuth = usePrevious({auth});

    useEffect(() => {
        if(prevAuth){
            if(prevAuth.auth !== auth){
                init(null, currentPage);
            }
        }
        checkAuth();
    }, [currentPage, auth]);

    const checkAuth = () => {
        axios.get('./api/checkAuth.php')
            .then(res => {
                setAuth(res.data.auth)
            })
    }

    const login = (pass) => {
        if(pass.length >= 5){
            axios.post('./api/login.php', {
                "password": pass
            }).then((res) => {
                setAuth(res.data.auth)
                if(!auth){
                    setPassError("Invalid password. Try again!")
                }
            })
        }
    }

    const logout = () => {
        axios.get('./api/logout.php')
            .then(() => {
                window.location.replace("/");
            })
    }

    const init = (e, page) => {
        if(e){
            e.preventDefault();
        }
        if(auth){
            //const frame = document.querySelector("iframe");
            open(page, _workFrame);
            loadPageList()
        }

    };

    const open = async (page) => {

        loaderShow()
        setCurrentPage(page);


        await axios.get(`../${page}?rnd=${Math.random()}`) //get pure page.html without js and others scripts
            .then(res =>(DOMHelper.parseStrToDOM(res.data))) // convert string to dom structure
            .then(DOMHelper.wrapTextNodes) //wrap all text nodes with custom tags to editing
            .then(DOMHelper.wrapImages) //wrap all images
            .then(dom => {
                _virtualDom.current = dom; // SAVE PURE DOM STRUCTURE
                return dom
            })
            .then(DOMHelper.serializeDOMToString) //DOM -> STRING
            .then(html => axios.post('./api/saveTempPage.php', {html})) // create temp dirty page
            .then(() => _workFrame.current.load('../iwoc3fh38_09fksd.html')) //load dirty version to iframe
            .then(() => axios.post('./api/deleteTempPage.php'))
            .then(() => {
                loadBackupsList(page);
            })
            .then(() => enableEditing()) //enable editing
            .then(() => injectStyles()) //styles when editing
            .then(() => loaderHide())
    };

    //edition functions
    const enableEditing = () => {
        _workFrame.current.contentDocument.body.querySelectorAll("text-editor").forEach(element => {
            const id = element.getAttribute("nodeid");
            //write changes from dirty copy to pure
            const virtualElement = _virtualDom.current.body.querySelector(`[nodeid="${id}"]`);
            new TextEditor(element, virtualElement)
        });

        _workFrame.current.contentDocument.body.querySelectorAll("[editable-img-id]").forEach(element => {
            const id = element.getAttribute("editable-img-id");
            //write changes from dirty copy to pure
            const virtualElement = _virtualDom.current.body.querySelector(`[editable-img-id="${id}"]`);
            new ImagesEditor(element, virtualElement, loaderShow, loaderHide, alertShow)
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
            [editable-img-id]:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
        `;
        document.querySelector("iframe").contentDocument.head.appendChild(style);
    };

    const savePage = async () => {
        loaderShow();
        const newDom = _virtualDom.current.cloneNode(_virtualDom.current);
        DOMHelper.unWrappedTextNodes(newDom);
        DOMHelper.unWrapImages(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        try{
            await axios.post("./api/savePage.php", {
                "pageName": currentPage,
                html
            })
            alertShow('success', 'Success!', 'Your changes was saved')
            loadBackupsList(currentPage);
        } catch (e) {
            alertShow('danger', 'Error!', 'Some error')
        }
        loaderHide();
    };

    const loadBackupsList = (page = currentPage) => {
            axios.get('./backups/backups.json')
                .then((response) => {

                    setPageState(pageState => {
                        return{
                        ...pageState,
                        backupsList: response.data.filter(backup => {
                            return backup.page === page
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
            console.log(e.message);
        }
    };

    return(
        <>
            {
                !auth
                    ? <Login login={login} passError = {passError}/>
                    :   <>
                        <nav className="navbar">
                            <div className="col-1">
                                <div className="logo-container">
                                    <img src='./assets/images/logoAdmin.png' alt="AdminLogo"/>
                                </div>
                            </div>
                            <div className="col-5">
                                <AlertCustom />
                            </div>
                            <div className="col-6 d-flex justify-content-around">
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
                            </div>
                        </nav>
                        <iframe src = '' frameBorder="0" ref = {_workFrame}></iframe>  {/*from folder admin > main folder where located index.html*/}
                        <input
                            id="img-upload"
                            type="file"
                            accept="image/*"
                            style={{display: 'none'}}
                        />
                        <ModalCustom />
                    </>
            }

            {loader.isVisible ? <Loader/> : null}
        </>
    )
};

export default Admin
