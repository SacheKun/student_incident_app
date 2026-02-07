import { useState, useEffect } from "react";
import {
    FaUserCircle,
    FaClipboardList,
    FaPlusCircle,
    FaUserPlus,
    FaSignOutAlt,
    FaFileAlt,
} from "react-icons/fa";
import IncidentForm from "./IncidentForm.jsx";
import IncidentTable from "./IncidentTable.jsx";
import CreateProfile from "./CreateProfile.jsx";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
    const [activePage, setActivePage] = useState("dashboard");
    const [stats, setStats] = useState({
        totalUsers: 0,
        teachers: 0,
        guidance: 0,
        admins: 0,
        totalIncidents: 0,
    });

    // Fetch stats
    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Total users by role
            const { data: usersData, error: usersError } = await supabase
                .from("profiles")
                .select("role");

            if (usersError) throw usersError;

            const totalUsers = usersData.length;
            const teachers = usersData.filter(
                (u) => u.role === "teacher",
            ).length;
            const guidance = usersData.filter(
                (u) => u.role === "guidance",
            ).length;
            const admins = usersData.filter((u) => u.role === "admin").length;

            // Total incidents
            const { data: incidentsData, error: incidentsError } =
                await supabase.from("incidents").select("*");

            if (incidentsError) throw incidentsError;

            setStats({
                totalUsers,
                teachers,
                guidance,
                admins,
                totalIncidents: incidentsData.length,
            });
        } catch (err) {
            console.error("Error fetching stats:", err.message);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    const renderPage = () => {
        switch (activePage) {
            case "create":
                return <IncidentForm />;
            case "list":
                return <IncidentTable />;
            case "profile":
                return <CreateProfile />;
            default:
                // Dashboard summary
                return (
                    <div className="p-6 text-gray-100">
                        <h1 className="text-2xl font-semibold mb-6">
                            Admin Dashboard
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-800 p-4 rounded-xl shadow">
                                <p className="text-sm text-gray-400">
                                    Total Users
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.totalUsers}
                                </p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-xl shadow">
                                <p className="text-sm text-gray-400">
                                    Teachers
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.teachers}
                                </p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-xl shadow">
                                <p className="text-sm text-gray-400">
                                    Guidance
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.guidance}
                                </p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-xl shadow">
                                <p className="text-sm text-gray-400">Admins</p>
                                <p className="text-2xl font-bold">
                                    {stats.admins}
                                </p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-xl shadow">
                                <p className="text-sm text-gray-400">
                                    Total Incidents
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.totalIncidents}
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-6">
                        <FaUserCircle className="h-10 w-10 mr-2 text-indigo-500" />
                        <span className="font-bold text-lg">Admin</span>
                    </div>

                    <nav className="flex flex-col space-y-2">
                        <button
                            onClick={() => setActivePage("dashboard")}
                            className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition ${
                                activePage === "dashboard" ? "bg-gray-700" : ""
                            }`}
                        >
                            <FaClipboardList className="h-5 w-5 mr-2" />
                            Dashboard
                        </button>

                        <button
                            onClick={() => setActivePage("create")}
                            className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition ${
                                activePage === "create" ? "bg-gray-700" : ""
                            }`}
                        >
                            <FaPlusCircle className="h-5 w-5 mr-2" />
                            Create Incident
                        </button>

                        <button
                            onClick={() => setActivePage("list")}
                            className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition ${
                                activePage === "list" ? "bg-gray-700" : ""
                            }`}
                        >
                            <FaClipboardList className="h-5 w-5 mr-2" />
                            Incident List
                        </button>

                        <button
                            onClick={() => setActivePage("profile")}
                            className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition ${
                                activePage === "profile" ? "bg-gray-700" : ""
                            }`}
                        >
                            <FaUserPlus className="h-5 w-5 mr-2" />
                            Create Profile
                        </button>
                    </nav>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 mt-4 rounded-lg hover:bg-gray-700 transition text-red-500 font-semibold"
                >
                    <FaSignOutAlt className="h-5 w-5 mr-2" />
                    Logout
                </button>
            </div>

            {/* Page content */}
            <div className="flex-1">{renderPage()}</div>
        </div>
    );
}
