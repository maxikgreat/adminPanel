import axios from 'axios';
import React, {useState, useEffect} from 'react'

const Editor = () => {

    const [pageState, setPageState] = useState({
        pageList: [],
        newPageName: ""
    });

    useEffect(() => {
        loadPageList();
    }, []);

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

    const renderPages = () => {
        return pageState.pageList.map((page, index) => {
            return <h1 key={index}>{page}</h1>
        })
    };

    return(
        <>
            <input
                onChange={(e) => {setPageState(
                    {...pageState, newPageName: e.target.value})
                }}
                type='text'
            />
            <button onClick = {() => {createNewPage()}}>Create a page</button>
            {renderPages()}
        </>
    )
};

export default Editor
