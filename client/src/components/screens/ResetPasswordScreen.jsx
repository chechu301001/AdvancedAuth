import {useState} from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

import "./ResetPasswordScreen.css"


const ResetPasswordScreen = ({match}) => {

    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cpassword, setCpassword] = useState('')

    const resetPasswordHandler = async (e) => {
        e.preventDefault();

        const config ={
            Headers: {
                "Content-Type": "application/json"
            }
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
                    {error && <span className="error-message">{error}</span>}
                    {success && <span className="success-message">{success} <NavLink to="/login">Login</NavLink></span>}
                    <form onSubmit={resetPasswordHandler}>

                    <div className="mb-2">
                    <input type="password" className="form-control" required name="password" placeholder="New Password" id="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="mb-2">
                    <input type="password" className="form-control" name="cpassword" placeholder="Confirm Password" id="cpassword"
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

