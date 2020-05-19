import React, { useContext } from "react";
import { SubmenuContext } from "../../context/submenu/submenuContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SubmenuCustom = () => {
    const { submenu } = useContext(SubmenuContext);

    const containerStyles = {
        position: "absolute",
        top: `${submenu.coordY}px`,
        left: `${submenu.coordX}px`,
    };

    if (!submenu.visible) {
        return null;
    }

    const onSwitchOpt = (e) => {
        e.target.classList.toggle("active");
    };

    function renderTextOptions() {
        return submenu.textOpts.map((item, index) => {
            return (
                <FontAwesomeIcon
                    key={index}
                    icon={item}
                    onClick={(e) => onSwitchOpt(e)}
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
                    style={{color: item}}
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
        </div>
    );
};

export default SubmenuCustom;
