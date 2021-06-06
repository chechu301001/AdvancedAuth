import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './PrivateScreen.css';

const PrivateScreen = ({history}) => {

    const [error, setError] = useState('');
    const [privateData, setPrivateData] = useState('')
    
    useEffect(() =>{

        //FETCHING PRIVATE DATA
        const fetchPrivateData = async () => {
            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            }
            //IF ALL GOOD THEN,
            try {
                const {data} = await axios.get('/api/private', config)
                setPrivateData(data.data)//PRIVATE DATA FIELD VALUES
            } catch (error) {
                localStorage.removeItem("authToken")
                setError("You are not authorized. Please Login")
            }
        }

        fetchPrivateData();

    }, []);

    const logoutHandler = () => {
        localStorage.removeItem("authToken")
        history.push("/login")
    }

    return (
        //TERNARY
        error? <span className="error-message">{error}</span> : <>
            <div style={{background: "green", color:"white"}}>{privateData}</div>
            <button onClick={logoutHandler}>Logout</button>
        </>
    )
}

export default PrivateScreen;