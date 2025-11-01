import React, { useEffect, useState } from "react";
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

export default function ParentDashboard({ user }) {
  const [student, setStudent] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [month, setMonth] = useState(9); // 0=Jan, 9=Oct
  const [year, setYear] = useState(2025);
  const [loading, setLoading] = useState(true);

  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRAiWzUf9CfGsh6kUFgrC9ZKFfaCHKebvmyRFlwanYVV0DKXdknVh-nLy7Wp30VdcN--81XKp5-8V12/pub?output=csv";

  const ATTENDANCE_SHEET =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC-kZQtaALHLu-KfIGsltaf1eELaPV40axRv-Cga6W4DHLm4xXc5cxVkL_acwcfS7K7S6Ecz9-TccQ/pub?output=csv";

  useEffect(() => {
    if (!user?.studentId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      const [studentData, attendanceData] = await Promise.all([
        fetchStudent(user.studentId),
        fetchAttendance(user.studentId),
      ]);

      setStudent(studentData);
      setAttendanceList(attendanceData);
      setLoading(false);

      if (studentData) drawChart(studentData);
    }

    fetchData();
  }, [user]);

  async function fetchStudent(studentId) {
    try {
      const res = await fetch(SHEET_URL);
      const text = await res.text();
      const rows = text
        .split(/\r?\n/)
        .map((r) => r.split(",").map((c) => c.replace(/^"|"$/g, "").trim()));
      const headers = rows[0];
      const data = rows.slice(1);

      const found = data.find(
        (r) => r[headers.indexOf("studentId")] === studentId
      );

      if (found) {
        const obj = {};
        headers.forEach((h, i) => (obj[h] = found[i]));
        return obj;
      }
      return null;
    } catch (error) {
      console.error("❌ Error fetching student:", error);
      return null;
    }
  }

  async function fetchAttendance(studentId) {
    try {
      const res = await fetch(ATTENDANCE_SHEET);
      const text = await res.text();
      const rows = text
        .split(/\r?\n/)
        .map((r) => r.split(",").map((c) => c.replace(/^"|"$/g, "").trim()));
      const headers = rows[0];
      const data = rows.slice(1);

      const attendance = data
        .filter((r) => r[headers.indexOf("studentId")] === studentId)
        .map((r) => ({
          date: r[headers.indexOf("date")],
          status: r[headers.indexOf("status")],
        }));

      return attendance;
    } catch (error) {
      console.error("❌ Error fetching attendance:", error);
      return [];
    }
  }

  function drawChart(data) {
    const ctx = document.getElementById("marksChart");
    if (!ctx) return;
    if (window.marksChartInstance) window.marksChartInstance.destroy();

    const subjects = ["📘 Maths", "📗 English", "🔬 Science"];
    const marks = [
      parseInt(data.maths || 0),
      parseInt(data.english || 0),
      parseInt(data.science || 0),
    ];

    const hasMarks = marks.some((m) => m > 0);

    if (!hasMarks) {
      const canvas = document.getElementById("marksChart");
      const context = canvas.getContext("2d");
      context.font = "16px Arial";
      context.fillText("No marks data available yet", 50, 100);
      return;
    }

    window.marksChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: subjects,
        datasets: [
          {
            label: "Marks",
            data: marks,
            backgroundColor: ["#fbc2eb", "#a1c4fd", "#c2e9fb"],
            borderColor: "#fff",
            borderWidth: 2,
            borderRadius: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } },
      },
    });
  }

  function changeMonth(direction) {
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
  }

  const currentMonthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  function renderCalendar() {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthAttendance = attendanceList.filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const dayMap = {};
    monthAttendance.forEach((entry) => {
      const day = new Date(entry.date).getDate();
      dayMap[day] = entry.status;
    });

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const status = dayMap[day] || "Not Marked";
      const color =
        status === "Present"
          ? "#4cd964"
          : status === "Absent"
          ? "#ff6b6b"
          : status === "Leave"
          ? "#ffd93d"
          : "#c4c4c4"; // Not marked = gray

      return (
        <div
          key={day}
          title={`${year}-${month + 1}-${day}: ${status}`}
          style={{ ...styles.dayBox, backgroundColor: color }}
        >
          <p style={styles.dayText}>{day}</p>
        </div>
      );
    });
  }

  if (loading)
    return (
      <div style={styles.center}>
        <div className="loader"></div>
        <p>Loading data...</p>
      </div>
    );

  return (
    <div style={{ animation: "fadeIn 0.8s ease-in" }}>
      <div style={styles.header}>
        <h1>🌈 Thailand Preschool Dashboard</h1>
        <p>Welcome, {user.name}!</p>
      </div>

      <div style={styles.container}>
        <div style={styles.infoCard}>
          <h3>👧 Student Info</h3>
          <p><b>Name:</b> {student?.name}</p>
          <p><b>Class:</b> {student?.className}</p>
          <p><b>Teacher:</b> {student?.teacher}</p>
          <p><b>Mood:</b> {student?.mood}</p>
          <p><b>Note:</b> {student?.note}</p>
        </div>

        <div style={styles.chartCard}>
          <h3>📊 Marks Overview</h3>
          <div style={{ height: "260px" }}>
            <canvas id="marksChart"></canvas>
          </div>
        </div>

        <div style={styles.attendanceCard}>
          <h3>🗓️ Attendance Calendar</h3>
          <div style={styles.monthHeader}>
            <button onClick={() => changeMonth(-1)} style={styles.navButton}>⬅️</button>
            <h4>{currentMonthName} {year}</h4>
            <button onClick={() => changeMonth(1)} style={styles.navButton}>➡️</button>
          </div>

          <div style={styles.calendarGrid}>{renderCalendar()}</div>

          <div style={styles.legend}>
            <span>🟩 Present</span> 
            <span>🟥 Absent</span> 
            <span>🟨 Leave</span> 
            <span>⬜ Not Marked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    textAlign: "center",
    background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    color: "#fff",
    padding: "25px 0",
    borderRadius: "0 0 25px 25px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "25px",
    padding: "30px",
  },
  infoCard: {
    background: "linear-gradient(135deg, #fff 0%, #fef6f9 100%)",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  chartCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f9fbff 100%)",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  attendanceCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f7fff9 100%)",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  monthHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  navButton: {
    background: "#ff9a9e",
    border: "none",
    borderRadius: "8px",
    padding: "5px 10px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginTop: "15px",
  },
  dayBox: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  dayText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: "14px",
  },
  legend: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "15px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#444",
  },
  center: {
    textAlign: "center",
    marginTop: "100px",
    color: "#666",
  },
};
