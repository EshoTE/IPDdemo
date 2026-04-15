import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('name', name);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">

      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Create an Account</h2>
            <p className="text-gray-400">Join us today by entering your details below.</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/10 border border-white/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
                <span className="text-sm">📷</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
                />
              </div>
              <div>
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
            </div>

            <div className="mb-6">
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
              <p className="text-xs text-red-400 mt-1">Please enter the password</p>
            </div>

            <button
              type="submit"
              className="w-full bg-white/10 border border-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-all duration-300 font-medium text-lg mb-6"
            >
              SIGN UP
            </button>

            <p className="text-center text-gray-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-gray-300 font-medium hover:text-white hover:underline transition-colors"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>

      <div className="w-1/2 bg-gray-900 border-l border-white/10 flex items-center justify-center p-12 relative overflow-hidden">
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8 z-10 max-w-md w-full">
          <div className="text-center mb-6">
            <h3 className="text-white text-xl font-bold mb-4">All Transactions</h3>
            <p className="text-sm text-gray-500">2nd Jan to 21st Dec</p>
          </div>

          <div className="flex items-end justify-between h-48 gap-4">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg" style={{height: '60%'}}></div>
              <span className="text-xs mt-2 text-gray-500">Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg" style={{height: '75%'}}></div>
              <span className="text-xs mt-2 text-gray-500">Feb</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg" style={{height: '85%'}}></div>
              <span className="text-xs mt-2 text-gray-500">Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg" style={{height: '95%'}}></div>
              <span className="text-xs mt-2 text-gray-500">Apr</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg" style={{height: '45%'}}></div>
              <span className="text-xs mt-2 text-gray-500">May</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg" style={{height: '90%'}}></div>
              <span className="text-xs mt-2 text-gray-500">Jun</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg" style={{height: '100%'}}></div>
              <span className="text-xs mt-2 text-gray-500">Jul</span>
            </div>
          </div>

          <button className="mt-6 text-gray-400 text-sm font-medium hover:text-white hover:underline transition-colors">
            View More
          </button>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-700 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-800 rounded-full opacity-10 blur-3xl"></div>
      </div>

    </div>
  );
}

export default SignUp;