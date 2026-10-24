import React, { useState, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [sessions, setSessions] = useState([]);
  const [inputs, setInputs] = useState({
    weightBefore: "",
    weightAfter: "",
    duration: "",
    carbs: "",
    fluids: "",
    sodium: "",
    caffeine: "",
  });

  // Load saved sessions when the app opens
  useEffect(() => {
    const saved = localStorage.getItem("endurance_sessions");
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculateMetrics = (data) => {
    const wB = parseFloat(data.weightBefore) || 0;
    const wA = parseFloat(data.weightAfter) || 0;
    const time = parseFloat(data.duration) || 0;
    const carbs = parseFloat(data.carbs) || 0;
    const fluids = parseFloat(data.fluids) || 0;
    const sodium = parseFloat(data.sodium) || 0;
    const caffeine = parseFloat(data.caffeine) || 0;

    if (time === 0) return null;

    const hours = time / 60;
    const weightLossKg = wB - wA;
    const totalSweatLossMl =
      (weightLossKg > 0 ? weightLossKg * 1000 : 0) + fluids;

    return {
      sweatPerHour: Math.round(totalSweatLossMl / hours),
      carbsPerHour: Math.round(carbs / hours),
      fluidsPerHour: Math.round(fluids / hours),
      sodiumPerLitre: fluids > 0 ? Math.round(sodium / (fluids / 1000)) : 0,
      caffeinePerHour: Math.round(caffeine / hours),
    };
  };

  const handleSave = () => {
    const metrics = calculateMetrics(inputs);
    if (!metrics) {
      alert("Please enter at least a duration to save a session.");
      return;
    }

    const newSession = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      metrics: metrics,
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem("endurance_sessions", JSON.stringify(updatedSessions));

    // Clear inputs after saving
    setInputs({
      weightBefore: "",
      weightAfter: "",
      duration: "",
      carbs: "",
      fluids: "",
      sodium: "",
      caffeine: "",
    });
    setActiveTab("history");
  };

  const deleteSession = (id) => {
    const updatedSessions = sessions.filter((session) => session.id !== id);
    setSessions(updatedSessions);
    localStorage.setItem("endurance_sessions", JSON.stringify(updatedSessions));
  };

  const results = calculateMetrics(inputs);

  return (
    <div
      style={{
        backgroundColor: "#111827",
        color: "#fff",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: "#10B981",
          }}
        >
          Endurance Fueling Tracker
        </h1>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            borderBottom: "1px solid #374151",
            paddingBottom: "1rem",
          }}
        >
          <button
            onClick={() => setActiveTab("calculator")}
            style={{
              backgroundColor:
                activeTab === "calculator" ? "#10B981" : "transparent",
              color: activeTab === "calculator" ? "#111827" : "#9CA3AF",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab("history")}
            style={{
              backgroundColor:
                activeTab === "history" ? "#10B981" : "transparent",
              color: activeTab === "history" ? "#111827" : "#9CA3AF",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            History ({sessions.length})
          </button>
        </div>

        {activeTab === "calculator" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            {/* Inputs Section */}
            <div
              style={{
                backgroundColor: "#1F2937",
                padding: "1.5rem",
                borderRadius: "0.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #374151",
                  paddingBottom: "0.5rem",
                }}
              >
                Session Data
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    label: "Weight Before (kg)",
                    name: "weightBefore",
                    placeholder: "e.g. 75.0",
                  },
                  {
                    label: "Weight After (kg)",
                    name: "weightAfter",
                    placeholder: "e.g. 74.2",
                  },
                  {
                    label: "Duration (minutes)",
                    name: "duration",
                    placeholder: "e.g. 120",
                  },
                  {
                    label: "Carbs Consumed (g)",
                    name: "carbs",
                    placeholder: "e.g. 180",
                  },
                  {
                    label: "Fluids Consumed (ml)",
                    name: "fluids",
                    placeholder: "e.g. 1500",
                  },
                  {
                    label: "Sodium Consumed (mg)",
                    name: "sodium",
                    placeholder: "e.g. 1500",
                  },
                  {
                    label: "Caffeine Consumed (mg)",
                    name: "caffeine",
                    placeholder: "e.g. 100",
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label
                      style={{
                        fontSize: "0.875rem",
                        marginBottom: "0.25rem",
                        color: "#9CA3AF",
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type="number"
                      name={field.name}
                      value={inputs[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.25rem",
                        border: "1px solid #374151",
                        backgroundColor: "#374151",
                        color: "#fff",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Results Section */}
            <div
              style={{
                backgroundColor: "#1F2937",
                padding: "1.5rem",
                borderRadius: "0.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #374151",
                  paddingBottom: "0.5rem",
                }}
              >
                Hourly Metrics
              </h2>
              {results ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#9CA3AF" }}>Sweat Rate</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      {results.sweatPerHour}{" "}
                      <span
                        style={{
                          fontSize: "1rem",
                          fontWeight: "normal",
                          color: "#6B7280",
                        }}
                      >
                        ml/hr
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#9CA3AF" }}>Carb Intake</span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color:
                          results.carbsPerHour >= 80 ? "#10B981" : "#F59E0B",
                      }}
                    >
                      {results.carbsPerHour}{" "}
                      <span
                        style={{
                          fontSize: "1rem",
                          fontWeight: "normal",
                          color: "#6B7280",
                        }}
                      >
                        g/hr
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#9CA3AF" }}>Fluid Intake</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      {results.fluidsPerHour}{" "}
                      <span
                        style={{
                          fontSize: "1rem",
                          fontWeight: "normal",
                          color: "#6B7280",
                        }}
                      >
                        ml/hr
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#9CA3AF" }}>Relative Sodium</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      {results.sodiumPerLitre}{" "}
                      <span
                        style={{
                          fontSize: "1rem",
                          fontWeight: "normal",
                          color: "#6B7280",
                        }}
                      >
                        mg/L
                      </span>
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      onClick={handleSave}
                      style={{
                        padding: "1rem",
                        backgroundColor: "#10B981",
                        color: "#111827",
                        border: "none",
                        borderRadius: "0.25rem",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Save Session
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ color: "#6B7280", fontStyle: "italic" }}>
                  Enter your session duration to see calculations.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* History Tab */
          <div
            style={{
              backgroundColor: "#1F2937",
              padding: "1.5rem",
              borderRadius: "0.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                borderBottom: "1px solid #374151",
                paddingBottom: "0.5rem",
              }}
            >
              Past Sessions
            </h2>
            {sessions.length === 0 ? (
              <p style={{ color: "#6B7280" }}>
                No sessions saved yet. Calculate and save a session to see it
                here.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      backgroundColor: "#374151",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontWeight: "bold",
                          display: "block",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {session.date}
                      </span>
                      <span style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
                        {session.metrics.sweatPerHour} ml/hr sweat |{" "}
                        {session.metrics.carbsPerHour} g/hr carbs |{" "}
                        {session.metrics.sodiumPerLitre} mg/L sodium
                      </span>
                    </div>
                    <button
                      onClick={() => deleteSession(session.id)}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #EF4444",
                        color: "#EF4444",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
