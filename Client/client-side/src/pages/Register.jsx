import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import HandleLogin from "./Login";
import "../ui/Register.css"

function Register() {
    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [erp_id, setErp_id] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [password, Setpassword] = useState("")

    const HandleRegister = async () => {
        try {
            const payload = {
                erp_id,
                name,
                email,
                password,
                phone_number,
            };
            const response = await api.post("/registeruser", payload);
            console.log(response.data);
            alert(response.data.message);
            navigate("/login")
            
            setEmail("");
            setName("");
            setErp_id("");
            Setpassword("");
            setPhone_number("");

        } catch (error) {
            console.log(error);
            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Something went wrong");
            }
        }
    
    }


 return (
    <div className="register-container">
        <div className="register-box">

            <h1>Lost & Found</h1>

                <p>Create your account</p>

            <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="number"
                placeholder="Enter ERP Id"
                value={erp_id}
                onChange={(e) => setErp_id(e.target.value)}
            />

            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => Setpassword(e.target.value)}
            />

            <input
                type="tel"
                placeholder="Enter Phone Number"
                value={phone_number}
                onChange={(e) => setPhone_number(e.target.value)}
            />

            <button onClick={HandleRegister}>
                Register
             </button>
             <div className="bottom-text">
              Already have an account? <span onClick={() =>navigate("/login")}>Login</span>
            </div>

        </div>
    </div>
   )
}    

export default Register;