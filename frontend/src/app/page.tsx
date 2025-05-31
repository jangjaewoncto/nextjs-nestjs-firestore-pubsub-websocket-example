'use client'
import React from 'react'



// config
const backendPort = 3001;
const authorizationPayload = `handsomejang`

export const Home = () => {
    
    const websocketInstance = React.useRef<WebSocket | null>(null);

    React.useEffect(() => {
        // TODO : use wss instead of ws. 
        websocketInstance.current = new WebSocket(`${window.location.protocol === `http:` ? `ws://` : `wss://`}localhost:${backendPort}/ws?token=${authorizationPayload}`);

        websocketInstance.current.onopen = () => {
            console.log('WebSocket connection established');
        }

        websocketInstance.current.onmessage = (event) => {
            alert(`message received: ${event.data}`);
        }
    } , [])

    return <div>
        Hello world@
    </div>
}

export default Home;