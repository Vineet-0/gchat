import React from 'react';
import Chat from './pages/Chat';
import SideBar from './components/ChatBox/SideBar';

function App() {
    return (
        <div className={`w-full h-screen flex`}>
            <SideBar />
            <Chat />
        </div>
    );
}

export default App;
