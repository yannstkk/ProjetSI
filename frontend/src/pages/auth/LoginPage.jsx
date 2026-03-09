import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/logo.png";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const emailValid = /\S+@\S+\.\S+/.test(email);
    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const specialValid = /[!@#$%^&*]/.test(password);

    const passwordValid = lengthValid && uppercaseValid && specialValid;

    const handleSubmit = (e) => {
        e.preventDefault();

        if(emailValid && passwordValid){
            console.log("Login ok");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md">

                {/* ici Logo */}
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="logo"
                        className="mx-auto h-32"
                    />

                    <p className="mt-4 text-2xl font-semibold text-slate-700">
                        Business Analysis Tool
                    </p>
                </div>

                {/* ici conteneur */}
                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Login
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* ici traitement email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email
                            </label>

                            {!emailValid && email.length > 0 && (
                                <p className="text-red-500 text-sm mb-2">
                                    Email must contain @ and a valid domain
                                </p>
                            )}

                            <input
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                className={`w-full border rounded-lg px-4 py-3 outline-none
                ${email.length > 0 ? (emailValid ? "border-green-500" : "border-red-500") : "border-gray-300"}`}
                            />
                        </div>

                        {/* ici traitement mot de passe */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={()=>setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5"/>
                                    ) : (
                                        <EyeIcon className="h-5 w-5"/>
                                    )}
                                </button>

                            </div>

                            {/* ici regles de mot de passe */}
                            <div className="mt-3 text-sm space-y-1">

                                <div className={lengthValid ? "text-green-600" : "text-gray-500"}>
                                    {lengthValid ? "✓" : "○"} At least 8 characters
                                </div>

                                <div className={uppercaseValid ? "text-green-600" : "text-gray-500"}>
                                    {uppercaseValid ? "✓" : "○"} One uppercase letter
                                </div>

                                <div className={specialValid ? "text-green-600" : "text-gray-500"}>
                                    {specialValid ? "✓" : "○"} One special character
                                </div>

                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={!emailValid || !passwordValid}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            Login
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}