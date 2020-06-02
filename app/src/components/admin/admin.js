import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import "../../helpers/iframeLoader.js";
import DOMHelper from "../../helpers/domHelper";
import TextEditor from "../textEditor/textEditor";
import ImagesEditor from "../imagesEditor/imagesEditor";
import DnDEditor from "../dndEditor/dndEditor";
import SubmenuCustom from "../submenu/submenu";
import Login from "../login/login";
import { Navbar } from "react-bootstrap";
//icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faBars,
    faBold,
    faItalic,
    faPalette,
    faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//context
import { ModalContext } from "../../context/modal/modalContext";
import { AlertContext } from "../../context/alert/alertContext";
import { LoaderContext } from "../../context/loader/loaderContext";
import { SubmenuContext } from "../../context/submenu/submenuContext";
//UI
import ModalCustom from "../UI/modal";
import AlertCustom from "../UI/alert";
import Loader from "../UI/loader";
import Buttons from "../UI/buttons";
//hooks
import usePrevious from "../../customHooks/usePrevious";

library.add(faBars, faBold, faItalic, faPalette, faLink);

const Admin = () => {
    //context UI elements
    const { modalShow } = useContext(ModalContext);
    const { alertShow } = useContext(AlertContext);
    const { loaderShow, loaderHide, loader } = useContext(LoaderContext);
    const { showSubmenu, hideSubmenu } = useContext(SubmenuContext);
    //refs
    const _virtualDom = useRef(null);
    const _workFrame = useRef(null);
    //state
    const [currentPage, setCurrentPage] = useState("index.html");
    const [auth, setAuth] = useState(false);
    const [passError, setPassError] = useState("");
    const [pageState, setPageState] = useState({
        pageList: [],
        backupsList: [],
        newPageName: "",
    });

    const prevAuth = usePrevious({ auth });

    useEffect(() => {
        if (prevAuth) {
            if (prevAuth.auth !== auth) {
                init(null, currentPage);
            }
        }
        checkAuth();
        // document.addEventListener('click', e => {
        //     e.stopPropagation();
        //     hideSubmenu();
        // })
    }, [currentPage, auth]);

    const checkAuth = () => {
        axios.get("./api/checkAuth.php").then((res) => {
            setAuth(res.data.auth);
        });
    };

    const login = (pass) => {
        if (pass.length >= 5) {
            axios
                .post("./api/login.php", {
                    password: pass,
                })
                .then((res) => {
                    setAuth(res.data.auth);
                    if (!auth) {
                        setPassError("Invalid password. Try again!");
                    }
                });
        }
    };

    const logout = () => {
        axios.get("./api/logout.php").then(() => {
            window.location.replace("/");
        });
    };

    const init = (e, page) => {
        if (e) {
            e.preventDefault();
        }
        if (auth) {
            open(page, _workFrame);
            loadPageList();
        }
    };

    const open = async (page) => {
        loaderShow();
        setCurrentPage(page);

        await axios
            .get(`../${page}?rnd=${Math.random()}`) //get pure page.html without js and others scripts
            .then((res) => DOMHelper.parseStrToDOM(res.data)) // convert string to dom structure
            .then(DOMHelper.wrapTextNodes) //wrap all text nodes with custom tags to editing
            .then(DOMHelper.wrapImages) //wrap all images
            //.then(DOMHelper.wrapDnd)
            .then((dom) => {
                _virtualDom.current = dom; // SAVE PURE DOM STRUCTURE
                return dom;
            })
            .then(DOMHelper.serializeDOMToString) //DOM -> STRING
            .then((html) => axios.post("./api/saveTempPage.php", { html })) // create temp dirty page
            .then(() => _workFrame.current.load("../iwoc3fh38_09fksd.html")) //load dirty version to iframe
            .then(() => axios.post("./api/deleteTempPage.php"))
            .then(() => loadBackupsList(page))
            .then(() => enableEditing()) //enable editing
            .then(() => injectStyles()) //styles when editing
            .then(() => loaderHide());
    };

    const stopScrolling = () => {
        _workFrame.current.contentDocument.body.style.overflow = "hidden";
    };

    const enableScrolling = () => {
        _workFrame.current.contentDocument.body.style.overflow = "scroll";
    };

    //edition functions
    const enableEditing = () => {
        const workFrameContent = _workFrame.current.contentDocument;
        workFrameContent.body.addEventListener('click', e => {
            e.preventDefault();
            if(e.target.nodeName !== 'TEXT-EDITOR') {
                hideSubmenu();
            }
        })

        workFrameContent.body
            .querySelectorAll("text-editor")
            .forEach((element) => {
                const id = element.getAttribute("nodeid");
                //write changes from dirty copy to pure
                const virtualElement = _virtualDom.current.body.querySelector(
                    `[nodeid="${id}"]`
                );
                new TextEditor(
                    element,
                    virtualElement,
                    showSubmenu,
                    hideSubmenu,
                    stopScrolling,
                    enableScrolling
                );
            });

        workFrameContent.body
            .querySelectorAll("[editable-img-id]")
            .forEach((element) => {
                const id = element.getAttribute("editable-img-id");
                //write changes from dirty copy to pure
                const virtualElement = _virtualDom.current.body.querySelector(
                    `[editable-img-id="${id}"]`
                );
                new ImagesEditor(
                    element,
                    virtualElement,
                    loaderShow,
                    loaderHide,
                    alertShow
                );
            });
        workFrameContent.body = new DndEditor(workFrameContent.body).wrapDnd
    };

    const injectStyles = () => {
        const style = document
            .querySelector("iframe")
            .contentDocument.createElement("style");
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
        document
            .querySelector("iframe")
            .contentDocument.head.appendChild(style);
    };

    const savePage = async () => {
        loaderShow();
        // const temp = _virtualDom.current;
        const newDom = _virtualDom.current.cloneNode(true);
        //console.log('virtual dom', _virtualDom.current);
        // TODO submenu
        //console.log('new dom', newDom);
        //console.log('Equal', _virtualDom.current.isEqualNode(newDom));
        DOMHelper.unWrappedTextNodes(newDom);
        //console.log('new dom after unwrapping', newDom);
        DOMHelper.unWrapImages(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        try {
            await axios.post("./api/savePage.php", {
                pageName: currentPage,
                html,
            });
            alertShow("success", "Success!", "Your changes was saved");
            loadBackupsList(currentPage);
        } catch (e) {
            alertShow("danger", "Error!", "Some error while saving page");
        }
        loaderHide();
    };

    const loadBackupsList = async (page) => {
        await axios
            .get("./backups/backups.json")
            .then((response) => {
                setPageState((pageState) => {
                    return {
                        ...pageState,
                        backupsList: response.data.filter((backup) => {
                            return backup.page === page;
                        }),
                    };
                });
            })
            .catch(() => {
                alertShow("warning", "Warning!", "Backup files not exist yet");
            });
    };

    const restoreBackup = (e, backup) => {
        if (e) {
            e.preventDefault();
        }
        axios
            .post("./api/restoreBackup.php", {
                page: currentPage,
                file: backup,
            })
            .then(() => {
                open(currentPage);
                alertShow("success", "Success!", "Restored from backup");
            });
    };

    //pages functions
    const loadPageList = async () => {
        try {
            const response = await axios.get("./api/pageList.php");
            setPageState((pageState) => {
                return {
                    ...pageState,
                    pageList: response.data,
                };
            });
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <>
            {!auth ? (
                <Login login={login} passError={passError} />
            ) : (
                <>
                    <Navbar collapseOnSelect expand='lg'>
                        <div className='col-1 logo-hld'>
                            <div className='logo-container'>
                                <img
                                    src='./assets/images/logoAdmin.png'
                                    alt='AdminLogo'
                                />
                            </div>
                        </div>
                        <div className='mobile-alert'>
                            <AlertCustom />
                        </div>
                        <Navbar.Toggle aria-controls='toggleNav'>
                            <FontAwesomeIcon icon={"bars"} />
                        </Navbar.Toggle>
                        <Navbar.Collapse className='col-11 row' id='toggleNav'>
                            <div className='col-6'>
                                <AlertCustom />
                            </div>
                            <div className='col-6 d-flex justify-content-around p-0'>
                                <button 
                                    onClick={() => {
                                        console.log(_virtualDom.current)
                                    }}>show dom</button>
                                <Buttons
                                    modalShow={modalShow}
                                    savePage={savePage}
                                    pageState={pageState}
                                    init={init}
                                    _virtualDom={_virtualDom}
                                    restoreBackup={restoreBackup}
                                    logout={logout}
                                />
                            </div>
                        </Navbar.Collapse>
                    </Navbar>
                    <iframe src='' frameBorder='0' ref={_workFrame}></iframe>{" "}
                    {/*from folder admin > main folder where located index.html*/}
                    <input
                        id='img-upload'
                        type='file'
                        accept='image/*'
                        style={{ display: "none" }}
                    />
                    <ModalCustom />
                    {/* <SubmenuCustom workspace={_workFrame.current}/> */}
                </>
            )}

            {loader.isVisible ? <Loader /> : null}
        </>
    );
};

export default Admin;
