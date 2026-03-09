import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/logo.png";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

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

        if (emailValid && passwordValid) {
            console.log("Connexion ok");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <img
                        src={logo}
                        alt="logo"
                        className="mx-auto h-36 object-contain"
                    />
                </div>

                {/* Conteneur */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Connexion
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email
                            </label>

                            {email.length > 0 && (
                                emailValid ? (
                                    <p className="text-green-600 text-sm mb-2">
                                        Adresse email valide
                                    </p>
                                ) : (
                                    <p className="text-red-500 text-sm mb-2">
                                        L’email doit contenir @ et un domaine valide
                                    </p>
                                )
                            )}

                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemple@email.com"
                                isValid={emailValid && email.length > 0}
                                error={null}
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
                                    className={`w-full border rounded-lg px-4 py-3 pr-10 outline-none focus:border-blue-500 ${
                                        password.length > 0
                                            ? passwordValid
                                                ? "border-green-500"
                                                : "border-gray-300"
                                            : "border-gray-300"
                                    }`}
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

                            {/* Règles mot de passe */}
                            <div className="mt-3 text-sm space-y-1">
                                <div className={lengthValid ? "text-green-600" : "text-gray-500"}>
                                    {lengthValid ? "✓" : "○"} Au moins 8 caractères
                                </div>

                                <div className={uppercaseValid ? "text-green-600" : "text-gray-500"}>
                                    {uppercaseValid ? "✓" : "○"} Une majuscule
                                </div>

                                <div className={specialValid ? "text-green-600" : "text-gray-500"}>
                                    {specialValid ? "✓" : "○"} Un caractère spécial
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={!emailValid || !passwordValid}
                        >
                            Se connecter
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}