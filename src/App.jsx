import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import IncidentForm from "./pages/IncidentForm.jsx";
import IncidentTable from "./pages/IncidentTable.jsx";
import AnonymousIncidentForm from "./pages/AnonymousIncidentForm.jsx"; // <- your anon form
import Home from "./pages/Home.jsx";

export default function App() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);

    // Fetch user session
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const user = data.session?.user;
            if (user) {
                setUser(user);
                fetchRole(user.id);
            } else {
                setLoadingRole(false);
            }
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const user = session?.user;
                if (user) {
                    setUser(user);
                    fetchRole(user.id);
                } else {
                    setUser(null);
                    setRole(null);
                    setLoadingRole(false);
                }
            },
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    // Fetch role from profiles
    async function fetchRole(userId) {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", userId)
                .single();

            if (error) throw error;
            setRole(data?.role);
        } catch (err) {
            console.error("Error fetching role:", err.message);
        } finally {
            setLoadingRole(false);
        }
    }

    // Protected route
    const ProtectedRoute = ({ children, allowedRoles }) => {
        if (!user) return <Navigate to="/login" replace />;
        if (loadingRole)
            return (
                <div className="min-h-screen flex items-center justify-center text-gray-100">
                    Loading...
                </div>
            );
        if (allowedRoles && !allowedRoles.includes(role))
            return <Navigate to="/login" replace />;
        return children;
    };

    return (
        <Routes>
            {/* Login */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Admin dashboard */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Incident form */}
            <Route
                path="/incident-form"
                element={
                    <ProtectedRoute
                        allowedRoles={["teacher", "guidance", "admin"]}
                    >
                        <IncidentForm />
                    </ProtectedRoute>
                }
            />

            {/* Incident table */}
            <Route
                path="/incident-table"
                element={
                    <ProtectedRoute
                        allowedRoles={["teacher", "guidance", "admin"]}
                    >
                        <IncidentTable />
                    </ProtectedRoute>
                }
            />

            {/* Anonymous incident report (public) */}
            <Route path="/report" element={<AnonymousIncidentForm />} />

            {/* Redirect unknown */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
