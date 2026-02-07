import { useState } from "react";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function CreateProfile() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("teacher");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInvite = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);

        // 1️⃣ Sign up the user
        const { data: authData, error: authError } =
            await supabaseAdmin.auth.signUp({
                email,
                password,
            });

        if (authError) {
            toast.error("Error signing up user: " + authError.message);
            setLoading(false);
            return;
        }

        // 2️⃣ Insert profile for the logged-in user
        // No `id` field! RLS will allow this
        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .insert([{ role }]);

        if (profileError) {
            toast.error("Error creating profile: " + profileError.message);
        } else {
            toast.success(`User invited as ${role}!`);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setRole("teacher");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-gray-100 flex items-center justify-center">
            <Toaster position="top-right" />
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-semibold mb-6 text-center">
                    Admin Invite User
                </h1>

                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                        <span
                            className="absolute right-3 top-9 cursor-pointer text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="relative">
                        <label className="block text-sm text-gray-300 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type={showConfirm ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                        <span
                            className="absolute right-3 top-9 cursor-pointer text-gray-400"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            <option value="teacher">Teacher</option>
                            <option value="guidance">Guidance</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 text-gray-100 font-medium transition"
                    >
                        {loading ? "Creating..." : "Create User"}
                    </button>
                </form>
            </div>
        </div>
    );
}
