import { useState } from "react";
import api from "../api";
import "../ui/login.css"
import { useNavigate } from "react-router-dom";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const HandleLogin = async () => {
        try {
            const payload = {
                email,
                password
            };

            const response = await api.post("/login", payload)
            localStorage.setItem("token", response.data.access_token);
            console.log(localStorage.getItem("token"));
            console.log(response.data);
            alert(response.data.message);
            navigate("/dashboard");

            setEmail("");
            setPassword("");

            
        }
        catch (error) {
            console.log(error);
            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Something went wrong");
            }
        }
    }

    return (
    <div className="login-container">

        <div className="login-box">

            <h1>Welcome Back</h1>
            <p>Login to your account</p>

            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />

            <button onClick={HandleLogin}>
                Login
            </button>
            

            <div className="bottom-text">
                Don't have an account?
                <span onClick={() => navigate("/Register")}>
                    Register
                </span>
            </div>

        </div>

    </div>
   );
}

export default Login;
