import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', email);

    const userResponse = await fetch('http://localhost:8080/api/v1/users', {
        headers: { 'Authorization': `Bearer ${data.token}` }
    });
    const users = await userResponse.json();
    const currentUser = users.find(u => u.email === email);
    localStorage.setItem('name', currentUser.name);
    localStorage.setItem('userId', currentUser.id);

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">

      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Please enter your details to log in.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@termtrack.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white/10 border border-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium text-lg mb-6"
            >
              LOG IN
            </button>

            <p className="text-center text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-gray-300 font-medium hover:text-white hover:underline transition-colors"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>

      <div className="w-1/2 bg-gray-900 border-l border-white/10 flex items-center justify-center p-12 relative overflow-hidden">
        <div className="text-center z-10">
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8">
            <div className="w-20 h-20 bg-white/10 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">Track Your Income & Expenses</h3>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-700 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-800 rounded-full opacity-10 blur-3xl"></div>
      </div>

    </div>
  );
}

export default Login;