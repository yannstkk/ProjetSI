import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import logo from "../../../assets/logo.png";

export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const usernameValid = username.trim().length >= 2;

    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const specialValid = /[!@#$%^&*]/.test(password);
    const passwordValid = lengthValid && uppercaseValid && specialValid;

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameValid || !passwordValid) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok || data.isError) {
                alert("Identifiants incorrects. Veuillez réessayer.");
            } else {
                navigate("/projects");

            }
        } catch (err) {
            setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md">

                {/* Logo */}
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

                {/* Conteneur formulaire */}
                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Connexion
                    </h2>

                    {/* Message d'erreur global */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Identifiant
                            </label>

                            <p className="text-red-500 text-sm mb-2">
                                {!usernameValid && username.length > 0 &&
                                    "L'identifiant doit contenir au moins 2 caractères"}
                            </p>

                            <input
                                type="text"
                                placeholder="Votre identifiant"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full border rounded-lg px-4 py-3 outline-none
                                    ${username.length > 0
                                        ? (usernameValid ? "border-green-500" : "border-red-500")
                                        : "border-gray-300"}`}
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Mot de passe
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Entrez votre mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Règles de mot de passe */}
                            <div className="mt-3 text-sm space-y-1">
                                <div className={lengthValid ? "text-green-600" : "text-gray-500"}>
                                    {lengthValid ? "✓" : "○"} Au moins 8 caractères
                                </div>
                                <div className={uppercaseValid ? "text-green-600" : "text-gray-500"}>
                                    {uppercaseValid ? "✓" : "○"} Une lettre majuscule
                                </div>
                                <div className={specialValid ? "text-green-600" : "text-gray-500"}>
                                    {specialValid ? "✓" : "○"} Un caractère spécial (!@#$%^&*)
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!usernameValid || !passwordValid || loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                        >
                            {loading ? "Connexion en cours..." : "Se connecter"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
