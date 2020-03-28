
import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import '../../helpers/iframeLoader.js'
import DOMHelper from "../../helpers/domHelper";
import TextEditor from "../textEditor/textEditor";
//ui
//import ModalCustom from "../UI/modal";
//import AlertCustom from "../UI/alert";

const Admin = () => {

    const _virtualDom = useRef(null);
    //ui
    const [modal, setModalVisible] = useState(false);
    const [alert, setAlertVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState("index.html");
    const [pageState, setPageState] = useState({
        pageList: [],
        newPageName: ""
    });

    useEffect(() => {
        init(currentPage);
    }, []);

    const init = (page) => {
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
            .then(() => frame.load('../temp.html')) //load dirty version to iframe
            .then(() => enableEditing(frame)) //enable editing
            .then(() => injectStyles()) //styles when editing
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


    //pages functions
    const loadPageList = async () => {
        try{
            const response = await axios.get('./api');
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
            const response = await axios.post('./api/createNewPage.php', {
                "name": pageState.newPageName
            });
            loadPageList()
        } catch (e) {
            alert("Page is already exists!")
        }
    };

    const deletePage = async (page) => {
        try{
            const response = await axios.post('./api/deletePage.php', {
                "name": page
            });
            loadPageList()
        } catch (e) {
            alert("No page exists with this name")
        }
    };

    const save = async () => {
        const newDom = _virtualDom.current.cloneNode(_virtualDom.current);
        DOMHelper.unWrappedTextNodes(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        try{
            const response = await axios.post("./api/savePage.php", {
                "pageName": currentPage,
                html
            })
        } catch (e) {
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
            <nav className="navbar navbar-dark bg-light">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick = {() => {
                        setModalVisible(true);
                    }}
                >Save</button>
            </nav>
            <iframe src = {currentPage} frameBorder="0"></iframe>  {/*from folder admin > main folder where located index.html*/}
            {/*TODO REDUCER FOR MODAL AND ALERT*/}


        </>
    )
};

export default Admin
