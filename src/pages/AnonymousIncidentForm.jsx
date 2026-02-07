import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function AnonymousIncidentForm() {
    const [studentName, setStudentName] = useState("");
    const [gradeSection, setGradeSection] = useState("");
    const [incidentType, setIncidentType] = useState("Bullying");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Use auto timestamp if your column is `created_at` OR replace with `date` if exists
        const { error } = await supabase.from("incidents").insert([
            {
                student_name: studentName,
                grade_section: gradeSection,
                incident_type: incidentType,
                description,
                incident_date: date,
                // If your table has `date` column, use: date
                // Otherwise, omit it to let Supabase default timestamp handle it
            },
        ]);

        if (error) {
            toast.error("Error submitting incident: " + error.message);
        } else {
            toast.success("Incident submitted successfully!");
            setStudentName("");
            setGradeSection("");
            setIncidentType("Bullying");
            setDescription("");
            setDate("");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
            <Toaster position="top-right" />
            <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-semibold mb-6 text-center">
                    Anonymous Incident Report
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Student Name */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Student Name
                        </label>
                        <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Grade / Section */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Grade / Section
                        </label>
                        <input
                            type="text"
                            required
                            value={gradeSection}
                            onChange={(e) => setGradeSection(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Incident Type */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Incident Type
                        </label>
                        <select
                            value={incidentType}
                            onChange={(e) => setIncidentType(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            <option>Bullying</option>
                            <option>Language</option>
                            <option>Digital Misuse</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Date (optional if using auto timestamp) */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 text-gray-100 font-medium transition"
                    >
                        Submit Report
                    </button>
                </form>

                {/* Back Button */}
                <div className="mt-4 text-center">
                    <Link
                        to="/"
                        className="text-indigo-500 hover:underline font-medium"
                    >
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
