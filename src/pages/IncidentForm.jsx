import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function IncidentForm() {
    const [studentName, setStudentName] = useState("");
    const [gradeSection, setGradeSection] = useState("");
    const [incidentType, setIncidentType] = useState("Bullying");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("incidents").insert([
            {
                student_name: studentName,
                grade_section: gradeSection,
                incident_type: incidentType,
                description,
                incident_date: date,
            },
        ]);

        if (error) {
            toast.error("Error submitting incident: " + error.message);
        } else {
            toast.success("Incident submitted successfully!");
            // Reset form
            setStudentName("");
            setGradeSection("");
            setIncidentType("Bullying");
            setDescription("");
            setDate("");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen p-6 bg-gray-900 text-gray-100">
            <Toaster position="top-right" />
            <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Create Incident</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2 text-gray-100 font-medium transition"
                    >
                        {loading ? "Submitting..." : "Submit Incident"}
                    </button>
                </form>
            </div>
        </div>
    );
}
