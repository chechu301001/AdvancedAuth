import {useState} from 'react'
import axios from 'axios'
import {NavLink} from 'react-router-dom'

import "./ForgotPasswordScreen.css"


const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const forgotPasswordHandler = async (e) => {
        e.preventDefault();

        const config ={
            header: {
                "Content-Type": "application/json"
            }
        }

        try {
            const {data} = await axios.put('/api/auth/forgotpassword', {email},
            config);
            
            setSuccess(data.data);
            
        } catch (error) {
            setError(error.response.data.error);
            setEmail('');
            setTimeout(() =>{
                setError("")
            }, 5000);
        }
    }

    
    return (
        <div className="forgotpassword-screen">
            <div className="forgotpassword-container-box">
                    
                    <div className="forgotpassword-header">
                        <h1>Forgot password</h1>
                    </div>

                    <form onSubmit={forgotPasswordHandler}>

                    {error?
                        <div className="messages">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        <div className="error">
                            {error && <span className="error-message">{error}</span>}
                        </div>
                        </div>
                        :null
                    }
                    {success && <span className="success-message">{success}</span>} 
                      
                    <p className="forgotpassword-subtext">
                        Please enter the email address you registered your account with. We
                        will send you a RESET PASSWORD confirmation to this email id.
                    </p>
                    <div className="mb-2">
                    <input type="email" className="form-control" name="email" placeholder="Email Adress" id="email" autoComplete="off"
                        value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="links">
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button className="btn btn-primary" type="submit">Send Email</button>
                        </div>
                        <NavLink className="fortolog" to="/login">Back to Login</NavLink>
                    </div>
                    </form>
            </div>
            
        </div>
    )
}

export default ForgotPasswordScreen

