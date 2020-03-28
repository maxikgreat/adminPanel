import '../../helpers/iframeLoader.js'
import axios from 'axios';
import React, {useState, useEffect} from 'react'

const Editor = () => {
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
        setCurrentPage(currentPage => `../${page}`);
        frame.load(currentPage, () => {
            console.log(currentPage)
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
