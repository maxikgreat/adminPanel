
import React, {useState, useEffect, useRef, useContext} from 'react'
import axios from 'axios';
import '../../helpers/iframeLoader.js'
import DOMHelper from "../../helpers/domHelper";
import TextEditor from "../textEditor/textEditor";
//context
import {ModalContext} from "../../context/modal/modalContext";
import {AlertContext} from "../../context/alert/alertContext";
//UI
import ModalCustom from "../UI/modal";
import AlertCustom from "../UI/alert";
import {Spinner} from 'react-bootstrap'
import {LoaderContext} from "../../context/loader/loaderContext";
import Loader from "../UI/loader";

const Admin = () => {

    //context UI elements
    const {modalShow} = useContext(ModalContext);
    const {alertShow} = useContext(AlertContext);
    const {loaderShow, loaderHide, loader} = useContext(LoaderContext);

    const _virtualDom = useRef(null);

    const [currentPage, setCurrentPage] = useState("index.html");
    const [pageState, setPageState] = useState({
        pageList: [],
        newPageName: ""
    });

    useEffect(() => {
        init(null, currentPage);
    }, []);

    const init = (e, page) => {
        if(e){
            e.preventDefault();
        }
        loaderShow();
        const frame = document.querySelector("iframe");
        open(page, frame);
        loadPageList();
    };

    const open = (page, frame) => {

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
            .then(() => frame.load('../iwoc3fh38_09fksd.html')) //load dirty version to iframe
            .then(() => axios.post('./api/deleteTempPage.php'))
            .then(() => enableEditing(frame)) //enable editing
            .then(() => injectStyles()) //styles when editing
            .then(() => loaderHide())
    };

    //edition functions
    const enableEditing = (frame) => {
        frame.contentDocument.body.querySelectorAll("text-editor").forEach(element => {
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
    };

    //pages functions
    const loadPageList = async () => {
        try{
            const response = await axios.get('./api/pageList.php');
            setPageState({
                ...pageState,
                pageList: response.data
            })
        }
        catch(e){
            console.log(e.message)
        }
    };

    const createNewPage = async () => {
        try{
            await axios.post('./api/createNewPage.php', {
                "name": pageState.newPageName
            });
            loadPageList()
        } catch (e) {
            alert("Page is already exists!")
        }
    };

    const deletePage = async (page) => {
        try{
            await axios.post('./api/deletePage.php', {
                "name": page
            });
            loadPageList()
        } catch (e) {
            alert("No page exists with this name")
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
            <nav className="navbar bg-light">
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
                </div>
            </nav>
            <iframe src = {currentPage} frameBorder="0"></iframe>  {/*from folder admin > main folder where located index.html*/}
            <ModalCustom />
            {loader.isVisible ? <Loader/> : null}
        </>
    )
};

export default Admin
