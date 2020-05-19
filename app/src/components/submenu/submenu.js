import React, {useContext} from 'react';
import {SubmenuContext} from '../../context/submenu/submenuContext';

const SubmenuCustom = () => {
    const {submenu} = useContext(SubmenuContext);

    const containerStyles = {
        position: 'absolute',
        top: `${submenu.coordY}px`,
        left: `${submenu.coordX}px`
    }

    if(!submenu.visible) {
        return null;
    }

    return (
        <div 
            className="submenu-container" 
            style={containerStyles}
        >
            <h2>i'm submenu</h2>
        </div>
    )
}

export default SubmenuCustom;