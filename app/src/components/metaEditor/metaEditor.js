
import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

const MetaEditor = ({virtualDom, onClose}) => {

    useEffect(() => {
        getMeta()
    }, [virtualDom]);

    const [meta, setMeta] = useState({
        title: '',
        keywords: '',
        description: ''
    });

    const getMetaAttribute = (virtualDom) => {
        let title = virtualDom.current.head.querySelector('title')
            || virtualDom.current.head.appendChild(virtualDom.current.createElement('title'))

        let keywords = virtualDom.current.head.querySelector('meta[name="keywords"]');
        if(!keywords){
            keywords = virtualDom.current.head.appendChild(virtualDom.current.createElement('meta'))
            keywords.setAttribute("name", "keywords");
        }

        let description = virtualDom.current.head.querySelector('meta[name="description"]');
        if(!description){
            description = virtualDom.current.head.appendChild(virtualDom.current.createElement('meta'))
            description.setAttribute("name", "description");
        }

        return {title, keywords, description}
    }

    const getMeta = () => {
        const {title, keywords, description} =  getMetaAttribute(virtualDom);

        setMeta(meta => {return({
            ...meta,
            title: title.innerHTML || "",
            keywords: keywords.getAttribute('content') || "",
            description: description.getAttribute('content') || ""
        })})
    };

    const applyMeta = () => {
        const {title, keywords, description} =  getMetaAttribute(virtualDom);

        title.innerHTML = meta.title;
        keywords.setAttribute("content", meta.keywords);
        description.setAttribute("content", meta.description);
    };

    return(
        <>
            {console.log(meta)}
            <Modal.Body>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        value={meta.title}
                        onChange = {e => setMeta({
                            ...meta,
                            title: e.target.value
                        })}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        placeholder="Keywords"
                        rows="3"
                        value={meta.keywords}
                        onChange = {e => setMeta({
                            ...meta,
                            keywords: e.target.value
                        })}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        placeholder="Description"
                        rows="3"
                        value={meta.description}
                        onChange = {e => setMeta({
                            ...meta,
                            description: e.target.value
                        })}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick = {onClose}
                    >Cancel</button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick = {() => {
                            applyMeta();
                            onClose();
                        }}
                    >Accept</button>
            </Modal.Footer>
        </>
    )
};

export default MetaEditor