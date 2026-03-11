import { useEffect, useState } from "react";

import axios from "axios";

function App() {
  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [minScore, setMinScore] = useState(0);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // default High → Low
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/resumes")
      .then((response) => {
        setResumes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleUpload = async () => {
  if (!selectedFile) {
    alert("Please select a file first!");
    return;
  }

  const resumeData = {
    filename: selectedFile.name,
    score: Math.floor(Math.random() * 100),
    matched_skills: ["React", "JavaScript"],
    missing_skills: ["Node.js"]
  };

  try {
    const response = await fetch("http://localhost:5000/resumes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(resumeData)
    });

    const data = await response.json();

    setResumes(prev => [...prev, data]);

  } catch (error) {
    console.error("Upload failed:", error);
  }
};

  if (!resumes) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  const filteredResumes = resumes
    .filter((r) => r.score >= minScore)
    .filter((r) =>
      r.filename.toLowerCase().includes(search.toLowerCase())
    )
    .filter((resume)=>resume.score>=minScore)
    .sort((a, b) => sortOrder==="desc"?b.score-a.score:a.score-b.score);
  const skillCounts = {};

  filteredResumes.forEach((resume) => {
    resume.matched_skills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

const sortedSkills = Object.entries(skillCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5); // top 5 skills

  return (
    <div className={darkMode 
      ? "bg-gray-900 min-h-screen text-white p-10" 
      : "bg-gray-100 min-h-screen text-black p-10"}>

    {/* 🌙 DARK MODE TOGGLE BUTTON — PLACE HERE */}
    <div className="flex justify-end mb-6">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 rounded-xl shadow-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  
    
      <h1 className="text-4xl font-bold text-center mb-2 text-indigo-800">
        Resume Ranking Dashboard
      </h1>

      <p className="text-center text-gray-600 mb-6">
        Total Resumes: {filteredResumes.length}
      </p>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">

        <input
          type="text"
          placeholder="Search by filename..."
          className="px-4 py-2 rounded-lg shadow-md outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="number"
          placeholder="Minimum Score"
          className="px-4 py-2 rounded-lg shadow-md outline-none"
          onChange={(e) => setMinScore(Number(e.target.value))}
        />

        <input
          type="file"
          className="px-4 py-2 rounded-lg bg-white shadow-md"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Upload Resume
        </button>
        <button
  onClick={() =>
    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
  }
  className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
>
  Sort: {sortOrder === "desc" ? "High → Low" : "Low → High"}
</button>
      </div>

      {/* Skill Analytics Section */}
<div className="bg-white p-6 rounded-2xl shadow-xl mb-10">
  <h2 className="text-2xl font-bold text-indigo-700 mb-4">
    📊 Top Skills Analytics
  </h2>

  {sortedSkills.length === 0 ? (
    <p>No skills data available</p>
  ) : (
    sortedSkills.map(([skill, count], index) => (
      <div key={index} className="mb-4">
        <div className="flex justify-between">
          <span className="font-semibold">{skill}</span>
          <span>{count}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
          <div
            className="bg-indigo-600 h-3 rounded-full"
            style={{
              width: `${(count / filteredResumes.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    ))
  )}
</div>

            {/* Resume Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredResumes.map((resume, index) => {
          const isTop = index === 0;
          let category = "";

if (resume.score >= 80) {
  category = "Excellent";
} else if (resume.score >= 60) {
  category = "Good";
} else {
  category = "Needs Improvement";
}
          return (
            <div
              key={index}
              className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 
              hover:scale-105
              ${
                isTop
                  ? "bg-yellow-100 border-4 border-yellow-400"
                  : "bg-white"
              }`}
            >
              {isTop && (
                <div className="mb-2 text-yellow-600 font-bold text-lg">
                  🏆 Top Candidate
                </div>
              )}

              <h2 className="text-xl font-bold text-indigo-700">
                #{index + 1} — {resume.filename}
              </h2>

              <p className="mt-2 font-semibold">
                Score: {resume.score}
              </p>
              <div
  className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full
  ${
    resume.score >= 80
      ? "bg-green-500 text-white"
      : resume.score >= 60
      ? "bg-yellow-400 text-black"
      : "bg-red-500 text-white"
  }`}
>
  {category}
</div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className={`h-3 rounded-full ${
                    isTop ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${resume.score}%` }}
                ></div>
              </div>

              <p className="mt-3">
                <span className="font-semibold text-green-600">
                  Matched:
                </span>{" "}
                {resume.matched_skills.join(", ")}
              </p>

              <p>
                <span className="font-semibold text-red-600">
                  Missing:
                </span>{" "}
                {resume.missing_skills.join(", ")}
              </p>
              <button
  onClick={() => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${resume.filename}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }}
  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
>
  📥 Download Resume
</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;