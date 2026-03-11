import { useState } from "react";
import { Link } from "react-router";
import { User, LogOut, Settings, ChevronUp } from "lucide-react";

export function UserProfile() {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    return (
        <div className="border-t border-gray-200 p-3">
            <div className="relative">

                {/* Profile Button */}
                <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <User className="w-4 h-4" />
                    </div>

                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">Utilisateur</p>
                        <p className="text-xs text-gray-500">Business Analyst</p>
                    </div>

                    <ChevronUp
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                            profileMenuOpen ? "" : "rotate-180"
                        }`}
                    />
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">

                        <Link
                            to="/projects"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">Mes projets</span>
                        </Link>

                        <Link
                            to="/login"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-red-600"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Se déconnecter</span>
                        </Link>

                    </div>
                )}

            </div>
        </div>
    );
}