import React, { useContext, useState } from "react";
import { SubmenuContext } from "../../context/submenu/submenuContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputGroup, Form} from 'react-bootstrap';

const SubmenuCustom = ({workspace}) => {
    const { submenu } = useContext(SubmenuContext);
    const [inputs, setInputs] = useState({
        url: '',
        color: ''
    })

    const containerStyles = {
        position: "absolute",
        top: `${submenu.coordY}px`,
        left: `${submenu.coordX}px`,
    };

    if (!submenu.visible) {
        return null;
    }

    const onTextOpt = (action) => {
        switch(action){
            case 'bold':
                workspace.contentDocument.execCommand('bold');
                break;
            case 'italic':
                workspace.contentDocument.execCommand('italic');
                break;
            default:
                console.log("default opt");
                return;
        }
    };

    const onColorClick = (hash) => {
        workspace.contentDocument.execCommand('foreColor', false, hash);
    };


    const onColorCheckClick = () => {
        if(/^#([0-9A-F]{3}){1,2}$/i.test(inputs.color)) {
            onColorClick(inputs.color);
        }
    }

    const onLinkAttach = () => {
        let link = inputs.url;
        if(link) {
            if(!inputs.url.includes('https://www.')) {
                link = 'https://www.' + link;
            }
            if(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm.test(link)) {
                workspace.contentDocument.execCommand('createLink', false, link);
            } else {
                console.log("Invalid url")
            }
        }
    }

    function renderTextOptions() {
        return submenu.textOpts.map((item, index) => {
            return (
                <FontAwesomeIcon
                    key={index}
                    icon={item}
                    onClick={() => onTextOpt(item)}
                />
            );
        });
    }

    function renderColorOptions() {
        return submenu.colorOpts.map((item, index) => {
            return (
                <div 
                    key={index}
                    className="pick-color" 
                    style={{backgroundColor: item}}
                    onClick={() => onColorClick(item)}
                >
                </div>
            )
        })
    }

    return (
        <div 
            className='submenu-container' 
            style={containerStyles}
            onMouseDown={e => e.preventDefault()}
        >
            <div className="d-flex align-items-center">
                {renderTextOptions()}
                <input
                    type="text"
                    placeholder="google.com"
                    aria-describedby="inputGroupPrependLink"
                    value={inputs.url || ''}
                    onChange={(e) => setInputs({
                        ...inputs,
                        url: e.target.value
                    })}
                    onClick={(e) => e.target.focus()}
                />
                <InputGroup.Prepend
                    onClick={() => onLinkAttach()}
                >
                    <InputGroup.Text id="inputGroupPrependLink">link!</InputGroup.Text>
                </InputGroup.Prepend>
            </div>
            <div className="d-flex align-items-center mt-2">
                {renderColorOptions()}
                <input
                    type="text"
                    placeholder="#ffffff"
                    aria-describedby="inputGroupPrependColor"
                    value={inputs.color || ''}
                    onChange={(e) => setInputs({
                        ...inputs,
                        color: e.target.value
                    })}
                    onClick={(e) => e.target.focus()}
                />
                <InputGroup.Prepend
                    onClick={() => onColorCheckClick()}
                >
                    <InputGroup.Text id="inputGroupPrependColor">apply!</InputGroup.Text>
                </InputGroup.Prepend>
            </div>
        </div>
    );
};

export default SubmenuCustom;
