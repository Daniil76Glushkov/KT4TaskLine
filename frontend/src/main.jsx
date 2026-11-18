import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Задача выполняется...");
  const [error, setError] = useState("");

  useEffect(() => {
    const eventSource = new EventSource("/api/progress");

    eventSource.addEventListener("progress", (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
    });

    eventSource.addEventListener("complete", (event) => {
      const data = JSON.parse(event.data);
      setMessage(data.message);
      eventSource.close();
    });

    eventSource.onerror = () => {
      setError("Соединение с сервером потеряно. Обновите страницу, чтобы повторить.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <main>
      <h1>Прогресс задачи</h1>
      <p role="status">{error || message}</p>
      <progress aria-label="Прогресс задачи" value={progress} max="100" />
      <p>{progress}%</p>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
