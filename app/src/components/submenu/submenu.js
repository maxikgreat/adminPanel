import React, { useContext } from "react";
import { SubmenuContext } from "../../context/submenu/submenuContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputGroup, Form} from 'react-bootstrap';

const SubmenuCustom = ({workspace}) => {
    const { submenu } = useContext(SubmenuContext);

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
            default:
                console.log("default opt");
                return;
        }
    };

    const onColorClick = (hash) => {
        workspace.contentDocument.execCommand('foreColor', false, hash);
    };


    const onColorChange = (e) => {
        let hash = `#${e.target.value}`;
        if(/^#([0-9A-F]{3}){1,2}$/i.test(hash)) {
            onColorClick(hash);
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
            {renderTextOptions()}
            {renderColorOptions()}
            <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">#</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
                type="text"
                placeholder="color hash"
                aria-describedby="inputGroupPrepend"
                //value={textProps.color || ''}
                onChange={(e) => onColorChange(e)}
                onClick={(e) => e.target.focus()}
            />
        </div>
    );
};

export default SubmenuCustom;
