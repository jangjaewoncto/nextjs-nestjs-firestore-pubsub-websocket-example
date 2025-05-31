'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

// config
const backendPort = 3001;

export const Home = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const websocketInstance = React.useRef<WebSocket | null>(null);
    const [messages, setMessages] = React.useState<string[]>([]);

    React.useEffect(() => {
        // TODO : use wss instead of ws. 
        websocketInstance.current = new WebSocket(`${window.location.protocol === `http:` ? `ws://` : `wss://`}localhost:${backendPort}/ws?token=${token}`);

        websocketInstance.current.onopen = () => {
            console.log('WebSocket connection established');
        }

        websocketInstance.current.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        }
    } , [])

    return <div>
        Hello world@
        <button type="button" onClick={() => {
            websocketInstance.current?.send(JSON.stringify({
                type: 'eventsToServer',
                payload: {
                    hello: 'world'
                }
            }));
        }}>Send message</button>
        {messages.map((message, index) => (
            <div key={index}>{message}</div>
        ))}
    </div>
}

export default Home;