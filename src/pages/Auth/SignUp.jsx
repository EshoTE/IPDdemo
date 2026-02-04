import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create an Account</h2>
            <p className="text-gray-600">Join us today by entering your details below.</p>
          </div>

          {/* Profile Picture Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-4xl text-purple-400">👤</span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700">
                <span className="text-sm">📷</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input 
                  type="text"
                  placeholder="Alex"
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input 
                  type="email"
                  placeholder="alex@timetoprogram.com"
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-red-500 mt-1">Please enter the password</p>
            </div>

            <button 
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg mb-6"
            >
              SIGN UP
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-purple-600 font-medium hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Illustration with Chart */}
      <div className="w-1/2 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-12 relative overflow-hidden">
        <div className="bg-white rounded-3xl p-8 shadow-2xl z-10 max-w-md">
          <div className="text-center mb-6">
            <h3 className="text-gray-900 text-xl font-bold mb-4">All Transactions</h3>
            <p className="text-sm text-gray-500">2nd Jan to 21th Dec</p>
          </div>

          {/* Mock Bar Chart */}
          <div className="flex items-end justify-between h-48 gap-4">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-lg" style={{height: '60%'}}></div>
              <span className="text-xs mt-2 text-gray-600">Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-lg" style={{height: '75%'}}></div>
              <span className="text-xs mt-2 text-gray-600">Feb</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-lg" style={{height: '85%'}}></div>
              <span className="text-xs mt-2 text-gray-600">Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-lg" style={{height: '95%'}}></div>
              <span className="text-xs mt-2 text-gray-600">Apr</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-lg" style={{height: '45%'}}></div>
              <span className="text-xs mt-2 text-gray-600">May</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-lg" style={{height: '90%'}}></div>
              <span className="text-xs mt-2 text-gray-600">Jun</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-lg" style={{height: '100%'}}></div>
              <span className="text-xs mt-2 text-gray-600">Jul</span>
            </div>
          </div>

          <button className="mt-6 text-purple-600 text-sm font-medium hover:underline">
            View More
          </button>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-800 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
}

export default SignUp;