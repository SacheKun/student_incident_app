import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
            <h1 className="text-4xl font-bold mb-4 text-center">
                Student Welfare & Discipline System
            </h1>
            <p className="text-gray-400 mb-8 text-center max-w-lg">
                Welcome! If you witnessed or experienced an incident, you can
                report it anonymously using the button below.
            </p>

            <Link
                to="/report"
                className="bg-indigo-600 hover:bg-indigo-500 text-gray-100 px-6 py-3 rounded-lg text-lg font-medium transition"
            >
                Report an Incident
            </Link>
        </div>
    );
}
