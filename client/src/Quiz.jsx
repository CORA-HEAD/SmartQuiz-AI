import { useState, useRef } from "react";
import axios from "axios";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const baseURL = import.meta.env.VITE_BACKEND_URL;

function Quiz({ user }) {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  const inputRef = useRef(null);

  const startQuiz = async () => {
    if (!topic.trim()) {
      alert("Please enter a valid topic.");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/api/quiz`, { topic });
      setQuestions(res.data.questions || []);
      setStarted(true);
      setSubmitted(false);
      setSelectedAnswers({});
      setScore(0);
    } catch (error) {
      console.error("Quiz fetch error:", error);
      alert("Failed to fetch quiz. Check server or topic.");
    }
  };

  const handleSelect = (qIndex, optIndex) => {
    if (!submitted) {
      setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
    }
  };

  const finishQuiz = async () => {
    if (Object.keys(selectedAnswers).length === 0) {
      alert("Please select at least one answer.");
      return;
    }

    let newScore = 0;

    questions.forEach((q, idx) => {
      const selectedIdx = selectedAnswers[idx];
      if (selectedIdx === undefined) return;

      const optionLetter = String.fromCharCode(97 + selectedIdx); // 'a', 'b', 'c', ...

      console.log(
        `Q${idx + 1}: user="${optionLetter}" vs correct="${q.answer?.toLowerCase()}"`
      );

      if (optionLetter === q.answer?.toLowerCase()) {
        console.log("✅ Correct");
        newScore++;
      } else {
        console.log("❌ Incorrect");
      }
    });

    setScore(newScore);
    setSubmitted(true);

    if (user?.uid) {
      try {
        await addDoc(collection(db, "scores"), {
          uid: user.uid,
          email: user.email || "unknown",
          score: newScore,
          topic,
          timestamp: new Date(),
        });
        console.log("Score saved:", { uid: user.uid, topic, score: newScore });
      } catch (err) {
        console.error("Error saving score:", err);
        alert("Failed to save score.");
      }
    }
  };

  const resetQuiz = () => {
    setTopic("");
    setQuestions([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setStarted(false);
    setScore(0);
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {!started && (
        <div className="flex flex-col gap-4" ref={inputRef}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter quiz topic"
            className="border p-2 rounded shadow"
          />
          <button
            onClick={startQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Start Quiz
          </button>
        </div>
      )}

      {started && questions.length > 0 && (
        <div className="mt-6 space-y-6">
          {questions.map((q, idx) => (
            <div key={idx} className="border p-4 rounded shadow">
              <p className="font-semibold mb-2">
                {idx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const selected = selectedAnswers[idx] === i;
                  const optionLetter = String.fromCharCode(97 + i);
                  const isCorrect =
                    submitted && optionLetter === q.answer?.toLowerCase();

                  let bgColor = "bg-white";
                  if (isCorrect) bgColor = "bg-green-200 border-green-500";
                  else if (selected) bgColor = "bg-blue-700";

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(idx, i)}
                      disabled={submitted}
                      className={`block w-full text-left px-3 py-2 border rounded ${bgColor} ${
                        submitted ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-2 text-sm text-gray-700">
                  Correct Answer: <strong>{q.answer}</strong>
                </div>
              )}
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={finishQuiz}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          ) : (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold mb-4">
                You scored {score} out of {questions.length}
              </h2>
              <button
                onClick={resetQuiz}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Take Another Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {started && questions.length === 0 && (
        <div className="mt-6 text-center">
          <p>No questions available for this topic.</p>
          <button
            onClick={resetQuiz}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mt-4"
          >
            Try Another Topic
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
