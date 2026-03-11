import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";
import { UserProfile } from "./layout/UserProfile";

export function Layout() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 flex flex-col">
                <Sidebar />
                <UserProfile />
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col">
                <Header />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}