import { useState } from "react";
import userService from "../services/user-service";
import { useNavigate } from "react-router-dom";
import { largeLabelStyle } from "../styles/label-style";
import inputStyle from "../styles/input-style";
import buttonStyle from "../styles/button-style";
import { Link } from "react-router-dom";
import linkStyle from "../styles/link-syle";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();

    const submitHandler = async () => {
        try {
            if(email.length == 0 || password.length == 0) return toast.error("усі поля мають бути заповнені");
            const response = await userService.login({email, password});
            if(response!.status == "success") navigate("/projects");
        } catch (error: any) {
            const message = error?.response?.data.message;
            if(message) toast.error(message);
            else throw error;
        }
    }

    return <div className="flex justify-center pt-52">
        <div className="flex flex-col">
            <form className="rounded border shadow-lg p-4 flex flex-col gap-4">
                <div className={"text-center " + largeLabelStyle}>вхід в обліковий запис</div>
                <div className="flex justify-between">
                    <div>
                        <label>Електрона пошта</label>
                    </div>
                    <div>
                        <input className={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)}/>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div>
                        <label>Пароль</label>
                    </div>
                    <div>
                        <input className={inputStyle}  type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className={buttonStyle} type="button" onClick={submitHandler}>увійти</button>
                </div>
            </form>
            <div className="flex justify-center mt-4">
                <Link to="/registration" className={linkStyle}>cтворити обліковий запис</Link>
            </div>      
        </div>
    </div>
};

export default LoginPage;