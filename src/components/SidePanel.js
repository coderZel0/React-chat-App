import {React} from 'react';
import './sidepanel.css';
import Friends from './Friends'
import OpenRooms from './OpenRooms'
import NavPanel from './NavPanel';

const SidePanel = () => {
    return (
        <div className="sidePanel">
            <div className="panelInner">
                <NavPanel/>
                <Friends/>
                <OpenRooms/>
            </div>
        </div>
    )
}

export default SidePanel
