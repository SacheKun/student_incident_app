import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function IncidentTable() {
    const [incidents, setIncidents] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [loading, setLoading] = useState(true);

    // Fetch incidents from Supabase
    const fetchIncidents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("incidents")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching incidents:", error.message);
            setIncidents([]);
        } else {
            setIncidents(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    // Filtered incidents
    const filteredIncidents = incidents.filter((inc) => {
        const matchesName = inc.student_name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesType =
            filterType === "All" || inc.incident_type === filterType;
        return matchesName && matchesType;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Incident Reports</h1>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 space-y-2 md:space-y-0">
                <input
                    type="text"
                    placeholder="Search by student name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full md:w-1/2"
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                    <option>All</option>
                    <option>Bullying</option>
                    <option>Language</option>
                    <option>Digital Misuse</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading incidents...</p>
            ) : (
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full bg-gray-800 divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-100 font-semibold">
                                    Student Name
                                </th>
                                <th className="px-4 py-2 text-left text-gray-100 font-semibold">
                                    Grade/Section
                                </th>
                                <th className="px-4 py-2 text-left text-gray-100 font-semibold">
                                    Type
                                </th>
                                <th className="px-4 py-2 text-left text-gray-100 font-semibold">
                                    Description
                                </th>
                                <th className="px-4 py-2 text-left text-gray-100 font-semibold">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIncidents.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-4 py-2 text-center text-gray-400"
                                    >
                                        No incidents found.
                                    </td>
                                </tr>
                            )}

                            {filteredIncidents.map((inc) => (
                                <tr
                                    key={inc.id}
                                    className="hover:bg-gray-700 transition duration-150"
                                >
                                    <td className="px-4 py-2">
                                        {inc.student_name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {inc.grade_section}
                                    </td>
                                    <td className="px-4 py-2">
                                        {inc.incident_type}
                                    </td>
                                    <td className="px-4 py-2">
                                        {inc.description}
                                    </td>
                                    <td className="px-4 py-2">
                                        {inc.date
                                            ? new Date(
                                                  inc.date,
                                              ).toLocaleDateString()
                                            : new Date(
                                                  inc.created_at,
                                              ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
