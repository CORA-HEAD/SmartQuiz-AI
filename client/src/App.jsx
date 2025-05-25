// src/App.js
import { useState } from "react";
import Login from "./Login";

import Quiz from "./Quiz";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-start pt-8 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">SmartQuiz AI</h1>
      <div className="w-full max-w-3xl">
        {user ? <Quiz user={user} /> : <Login setUser={setUser} />}
      </div>
    </div>
  );
}

export default App;
