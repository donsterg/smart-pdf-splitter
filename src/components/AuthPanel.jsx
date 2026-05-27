import { useState }
from 'react';

import {
  signUp,
  signIn,
  signOut
} from '../services/authService';

export default function AuthPanel({
  user,
  setUser,
}) {

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const handleSignUp =
    async () => {

      setError('');

      const {
        data,
        error
      } = await signUp(
        email,
        password
      );

      if (error) {
        setError(error.message);
        return;
      }

      setUser(data.user);
    };

  const handleSignIn =
    async () => {

      setError('');

      const {
        data,
        error
      } = await signIn(
        email,
        password
      );

      if (error) {
        setError(error.message);
        return;
      }

      setUser(data.user);
    };

  const handleSignOut =
    async () => {

      await signOut();

      setUser(null);
    };

  if (user) {

    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border">

        <p className="mb-3 text-sm">
          Signed in as:
          <br />
          <strong>{user.email}</strong>
        </p>

        <button
          onClick={handleSignOut}
          className="
            bg-red-500
            text-white
            px-4 py-2
            rounded-lg
          "
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">

      <h2 className="font-bold text-lg">
        Account
      </h2>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="
          w-full
          border
          rounded-lg
          p-2
        "
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="
          w-full
          border
          rounded-lg
          p-2
        "
      />

      <div className="flex gap-2">

        <button
          onClick={handleSignIn}
          className="
            bg-indigo-600
            text-white
            px-4 py-2
            rounded-lg
          "
        >
          Login
        </button>

        <button
          onClick={handleSignUp}
          className="
            border
            border-indigo-600
            text-indigo-600
            px-4 py-2
            rounded-lg
            hover:bg-indigo-50
            transition-colors
          "
        >
          Sign Up
        </button>

      </div>
    </div>
  );
}