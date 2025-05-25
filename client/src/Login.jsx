//Google/Email Login UI

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

function Login({ setUser }) {
  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <button
        onClick={login}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Login with Google
      </button>
    </div>
  );
}

export default Login;
