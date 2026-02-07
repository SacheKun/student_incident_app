import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const user = data.session?.user;
            if (user) checkRole(user.id);
        });
    }, []);

    async function checkRole(userId) {
        try {
            const { data } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", userId)
                .single();

            if (!data) return;

            if (data.role === "admin") navigate("/admin");
            else navigate("/incident-form");
        } catch (err) {
            toast.error("Failed to get user role: " + err.message);
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
                setLoading(false);
                return;
            }

            toast.success("Login successful!");
            checkRole(data.user.id);
        } catch (err) {
            toast.error("Login failed: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <Toaster position="top-right" />
            <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">
                    Sign In
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm text-gray-400 mb-1">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                        <span
                            className="absolute right-3 top-9 cursor-pointer text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 transition rounded-lg py-2 text-gray-100 font-medium"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
