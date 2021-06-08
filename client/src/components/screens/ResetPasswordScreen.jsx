import {useState} from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

import "./ResetPasswordScreen.css"


const ResetPasswordScreen = ({history,match}) => {

    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cpassword, setCpassword] = useState('')

    const resetPasswordHandler = async (e) => {
        e.preventDefault();

        const config ={
            header: {
                "Content-Type": "application/json"
            },
        }
        if(password !== cpassword) {
            setPassword('')
            setCpassword('')

            setTimeout(() =>{
                setError("")
            }, 5000);
            return setError("Passwords do not match")
        }
        try {
            const {data} = await axios.put(`/api/auth/resetpassword/${match.params.resetToken}`, {password},
            config);

            console.log(data);

            setSuccess(data.data)
            history.push('/login');
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() =>{
                setError("")
            }, 5000);
        }
    }

    
    return (
        <div className="resetpassword-screen">
            <div className="resetpassword-container-box">
                <div className="resetpassword-box-left">
                    <div className="resetpassword-header">
                        <h1>Reset password</h1>
                    </div>
                    
                    <form onSubmit={resetPasswordHandler}>

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
                    {success && <span className="success-message">{success} <NavLink to="/login">Login</NavLink></span>}

                    <div className="mb-2">
                    <input type="password" className="form-control" required name="password" placeholder="New Password" id="password" autoComplete="off"
                        value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="mb-2">
                    <input type="password" className="form-control" name="cpassword" placeholder="Confirm Password" id="cpassword" autoComplete="off"
                        value={cpassword} onChange={(e) => setCpassword(e.target.value)}/>
                    </div>

                    <div className="links">
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button className="btn btn-primary" type="submit">Reset Password</button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordScreen

