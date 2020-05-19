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
        e.preventDefault();
        e.target.classList.toggle("active");
    };

    function renderOptions() {
        return ["bold", "italic", "palette"].map((item, index) => {
            return (
                <FontAwesomeIcon
                    key={index}
                    icon={item}
                    onMouseDown={(e) => onSwitchOpt(e)}
                />
            );
        });
    }

    return (
        <div className='submenu-container' style={containerStyles}>
            {renderOptions()}
        </div>
    );
};

export default SubmenuCustom;
