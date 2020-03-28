import '../../helpers/iframeLoader.js'
import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react'

const Editor = () => {

    const _virtualDom = useRef(null);
    const [currentPage, setCurrentPage] = useState("index.html");
    const [pageState, setPageState] = useState({
        currentPage: 'index.html',
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
            .then(res =>(parseStrToDOM(res.data))) // convert string to dom structure
            .then(wrapTextNodes) //wrap all text nodes with custom tags to editing
            .then(dom => {
                _virtualDom.current = dom; // SAVE PURE DOM STRUCTURE
                return dom
            })
            .then(serializeDOMToString) //DOM -> STRING
            .then(html => axios.post('./api/saveTempPage.php', {html})) // create temp dirty page
            .then(() => frame.load('../temp.html')) //load dirty version to iframe
            .then(() => enableEditing(frame)) //enable editing
    };

    const enableEditing = (frame) => {
        frame.contentDocument.body.querySelectorAll("text-editor").forEach(element => {
            element.contentEditable = true;
            element.addEventListener("input", () => {
                onTextEdit(element)
            })
        });
    };

    const onTextEdit = (element) => {
        const id = element.getAttribute("nodeid");
        //write changes from dirty copy to pure
        _virtualDom.current.body.querySelector(`[nodeid="${id}"]`).innerHTML = element.innerHTML;
    };

    const wrapTextNodes = (dom) => {
        const body = dom.body;
        let textNodes = [];
        // get all elements from iframe
        function recurse(element){
            element.childNodes.forEach(node => {
                // node is text and not 'empty'
                if(node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0){
                    textNodes.push(node);
                } else {
                    recurse(node)
                }
            })
        }

        recurse(body);

        textNodes.forEach((node, i) => {
            //give wrapper each text node with custom editable tag
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node); //create wrapper
            wrapper.appendChild(node); //add wrapper
            wrapper.setAttribute("nodeid", i);
        });
        return dom
    };

    const unWrappedTextNodes = (dom) => {
        dom.body.querySelectorAll("text-editor").forEach(element => {
            element.parentNode.replaceChild(element.firstChild, element);
        })
    };

    const serializeDOMToString = (dom) => {
      const serializer = new XMLSerializer();
      return serializer.serializeToString(dom);
    };

    const parseStrToDOM = (str) => {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    };

    const save = () => {
        const newDom = _virtualDom.current.cloneNode(_virtualDom.current);
        unWrappedTextNodes(newDom);
        const html = serializeDOMToString(newDom);
        axios.post("./api/savePage.php", {
            pageName: currentPage,
            html
        })
    };


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
            <button onClick={() => save()}>Click</button>
            <iframe src = {currentPage} frameBorder="0"></iframe>  {/*from folder admin > main folder where located index.html*/}
            {/*<input*/}
            {/*    onChange={(e) => {setPageState(*/}
            {/*        {...pageState, newPageName: e.target.value})*/}
            {/*    }}*/}
            {/*    type='text'*/}
            {/*/>*/}
            {/*<button onClick = {() => {createNewPage()}}>Create a page</button>*/}
            {/*{renderPages()}*/}
        </>
    )
};

export default Editor
