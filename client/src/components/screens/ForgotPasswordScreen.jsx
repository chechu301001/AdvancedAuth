import {useState} from 'react'
import axios from 'axios'

import "./ForgotPasswordScreen.css"


const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const forgotPasswordHandler = async (e) => {
        e.preventDefault();

        const config ={
            Headers: {
                "Content-Type": "application/json"
            }
        }

        try {
            const {data} = await axios.post('/api/auth/forgotpassword', {email},
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
                    {error && <span className="error-message">{error}</span>}
                    {success && <span className="success-message">{success}</span>}


                    <form onSubmit={forgotPasswordHandler}>
                    <p className="forgotpassword-subtext">
                        Please enter the email address you registered your account with. We
                        will send you a RESET PASSWORD confirmation to this email id.
                    </p>
                    <div className="mb-2">
                    <input type="email" className="form-control" name="email" placeholder="Email Adress" id="email"
                        value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="links">
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button className="btn btn-primary" type="submit">Send Email</button>
                        </div>
                    </div>
                    </form>
            </div>
        </div>
    )
}

export default ForgotPasswordScreen

