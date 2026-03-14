import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./app/components/ProtectedRoute";
import { Layout } from "./app/components/Layout";
import { Cockpit } from "./app/pages/Cockpit";

// Auth
import Login from "./app/pages/auth/LoginPage";
import { Projects } from "./app/pages/Projects";
import { NewProject } from "./app/pages/NewProject";

// Phase 1
import InterviewsList from "./app/pages/phase1/InterviewsList";
import NewInterview from "./app/pages/phase1/NewInterview";
import InterviewDetail from "./app/pages/phase1/InterviewDetail";
import { Phase1B } from "./app/pages/phase1/Phase1B";

// Phase 2
import { Phase2A } from "./app/pages/phase2/Phase2A";
import { Phase2B } from "./app/pages/phase2/Phase2B";
import { Phase2C } from "./app/pages/phase2/Phase2C";

// Phase 3
import { Phase3C } from "./app/pages/phase3/Phase3C";

// Phase 4
import { Phase4A } from "./app/pages/phase4/Phase4A";
import { Phase4B } from "./app/pages/phase4/Phase4B";
import { Phase4C } from "./app/pages/phase4/Phase4C";

// Phase 5
import { Phase5A } from "./app/pages/phase5/Phase5A";
import { Phase5B } from "./app/pages/phase5/Phase5B";

// Phase 6
import { Phase6A } from "./app/pages/phase6/Phase6A";
import { Phase6B } from "./app/pages/phase6/Phase6B";
import { Phase6C } from "./app/pages/phase6/Phase6C";

// Phase 7
import { Phase7A } from "./app/pages/phase7/Phase7A";
import { Phase7B } from "./app/pages/phase7/Phase7B";
import { Phase7C } from "./app/pages/phase7/Phase7C";

const protect = (element) => (
    <ProtectedRoute>{element}</ProtectedRoute>
);

export const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },

    { path: "/projects", element: protect(<Projects />) },
    { path: "/projects/new", element: protect(<NewProject />) },

    {
        path: "/dashboard",
        element: protect(<Layout />),
        children: [
            { index: true, element: <Cockpit /> },

            { path: "phase1/interviews", element: <InterviewsList /> },
            { path: "phase1/interview/new", element: <NewInterview /> },
            { path: "phase1/interview/:id", element: <InterviewDetail /> },
            { path: "phase1/interview", element: <Phase1B /> },

            { path: "phase2/actors", element: <Phase2A /> },
            { path: "phase2/flows", element: <Phase2B /> },
            { path: "phase2/coherence", element: <Phase2C /> },

            { path: "phase3/classification", element: <Phase3C /> },

            { path: "phase4/backlog", element: <Phase4A /> },
            { path: "phase4/form", element: <Phase4B /> },
            { path: "phase4/control", element: <Phase4C /> },

            { path: "phase5/generate", element: <Phase5A /> },
            { path: "phase5/matrix", element: <Phase5B /> },

            { path: "phase6/import", element: <Phase6A /> },
            { path: "phase6/viewer", element: <Phase6B /> },
            { path: "phase6/coverage", element: <Phase6C /> },

            { path: "phase7/import", element: <Phase7A /> },
            { path: "phase7/viewer", element: <Phase7B /> },
            { path: "phase7/control", element: <Phase7C /> },
        ],
    },
]);