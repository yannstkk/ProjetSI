import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";
import { UserProfile } from "./layout/UserProfile";
import { getProjetCourant } from "../../services/projetCourant";

export function Layout() {
    const token = sessionStorage.getItem("token");
    const projet = getProjetCourant();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!projet) {
        return <Navigate to="/projects" replace />;
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <div className="w-64 flex flex-col">
                <Sidebar />
                <UserProfile />
            </div>

            <div className="flex flex-1 flex-col">
                <Header />

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}