import React, { useState, useEffect } from 'react';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(''); 
  
  const [identifier, setIdentifier] = useState(localStorage.getItem('savedIdentifier') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('savedIdentifier'));
  const [token, setToken] = useState('');
  
  const [packages, setPackages] = useState([]);
  const [subUsers, setSubUsers] = useState([]);

  const [loginTab, setLoginTab] = useState('admin'); 
  const [forgotStep, setForgotStep] = useState(0); 
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [adminForm, setAdminForm] = useState({ username: '', email: '', password: '' });

  const [formData, setFormData] = useState({
    title: '', 
    price: '', 
    category: 'popular',
    route: 'JEDDAH, MAKKAH, MADINAH', 
    inclusions: 'Visa, Hotel, Transport', 
    makkah: '', 
    madinah: ''
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedRole = localStorage.getItem('adminRole');
    if (savedToken && savedRole) {
      setToken(savedToken);
      setUserRole(savedRole);
      setIsAuthenticated(true);
      fetchPackages();
      if (savedRole === 'superadmin') fetchUsers(savedToken);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://musafiroon-web.onrender.com/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      
      if (data.success) {
        let currentRole = data.role;
        if (identifier === 'mosafiroon.info@gmail.com' || identifier === 'mosafiroon7') {
          currentRole = 'superadmin'; 
        } else if (!currentRole) {
          currentRole = 'user'; 
        }

        if (loginTab === 'admin' && currentRole !== 'superadmin') {
          alert("Access Denied! Aap Admin nahi hain. User tab se login karein.");
          return;
        }
        if (loginTab === 'user' && currentRole === 'superadmin') {
          alert("Aap Super Admin hain! Admin tab se login karein.");
          return;
        }

        if (rememberMe) {
          localStorage.setItem('savedIdentifier', identifier);
        } else {
          localStorage.removeItem('savedIdentifier');
        }

        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminRole', currentRole);
        setToken(data.token);
        setUserRole(currentRole);
        setIsAuthenticated(true);
        fetchPackages();
        if(currentRole === 'superadmin') fetchUsers(data.token);
      } else { 
        alert(data.message || "Invalid Access!"); 
      }
    } catch (err) { alert("Server Error!"); }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://musafiroon-web.onrender.com/api/admin/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent to your email!");
        setForgotStep(2);
      } else { alert(data.message); }
    } catch (err) { alert("Server Error!"); }
  };

  const handleVerifyOTPAndReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://musafiroon-web.onrender.com/api/admin/reset-password-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password Reset Successful! You can login now.");
        setForgotStep(0); setResetEmail(''); setOtp(''); setNewPassword('');
      } else { alert(data.message); }
    } catch (err) { alert("Server Error!"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    setIsAuthenticated(false);
    window.location.reload(); 
  };

  const fetchPackages = () => {
    fetch('https://musafiroon-web.onrender.com/api/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPackages(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setPackages(data.data);
        } else {
          setPackages([]);
        }
      })
      .catch(err => {
        console.error("Packages fetch error:", err);
        setPackages([]);
      });
  };

  const fetchUsers = async (currentToken) => {
    try {
      const res = await fetch('https://musafiroon-web.onrender.com/api/admin/users', {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSubUsers(data);
      } else if (data && data.data && Array.isArray(data.data)) {
        setSubUsers(data.data);
      } else {
        setSubUsers([]);
      }
    } catch(err) {
      console.error("Users fetch error:", err);
      setSubUsers([]);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://musafiroon-web.onrender.com/api/admin/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(adminForm)
      });
      const data = await res.json();
      if (data.success) {
        alert("User Added!"); setAdminForm({ username: '', email: '', password: '' }); fetchUsers(token);
      } else { alert(data.message); }
    } catch (err) {}
  };

  const handleDeleteUser = async (id) => {
    if(window.confirm("Delete this user?")) {
      await fetch(`https://musafiroon-web.onrender.com/api/admin/users/${id}`, { 
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsers(token);
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    const newPkg = { 
      title: formData.title, 
      price: Number(formData.price), 
      category: formData.category, 
      route: formData.route.split(',').map(s=>s.trim()), 
      inclusions: formData.inclusions.split(',').map(s=>s.trim()), 
      distances: { makkah: formData.makkah, madinah: formData.madinah } 
    };
    try {
      const response = await fetch('https://musafiroon-web.onrender.com/api/packages', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newPkg)
      });
      if(response.ok) { 
        fetchPackages(); 
        setFormData({title:'', price:'', category:'popular', route:'JEDDAH, MAKKAH, MADINAH', inclusions:'Visa, Hotel, Transport', makkah:'', madinah:''}); 
      }
    } catch (error) {}
  };

  const handleDeletePackage = async (id) => {
    if(window.confirm("Delete Package?")) {
      await fetch(`https://musafiroon-web.onrender.com/api/packages/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchPackages();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-sm border-b-8 border-[#cca332]">
          
          {forgotStep === 0 && (
            <div className="flex mb-8 border-b-2 border-gray-100">
              <button 
                type="button"
                className={`flex-1 pb-3 font-black text-sm uppercase tracking-wider transition-all ${loginTab === 'admin' ? 'text-[#cca332] border-b-2 border-[#cca332] translate-y-[2px]' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setLoginTab('admin')}
              >
                Admin
              </button>
              <button 
                type="button"
                className={`flex-1 pb-3 font-black text-sm uppercase tracking-wider transition-all ${loginTab === 'user' ? 'text-[#cca332] border-b-2 border-[#cca332] translate-y-[2px]' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setLoginTab('user')}
              >
                User
              </button>
            </div>
          )}

          <h2 className="text-xl font-black text-center mb-6 tracking-tighter uppercase text-gray-800">
            {forgotStep > 0 ? "Reset Password" : (loginTab === 'admin' ? 'Master Access' : 'User Access')}
          </h2>
          
          {forgotStep === 0 && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
              <input 
                type="text" 
                placeholder={loginTab === 'admin' ? "Admin Email / Username" : "User Email / Username"} 
                className="w-full bg-gray-50 border p-4 rounded outline-none focus:border-[#cca332] transition-colors" 
                value={identifier} 
                onChange={e => setIdentifier(e.target.value)} 
                autoComplete="username"
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-gray-50 border p-4 rounded outline-none focus:border-[#cca332] transition-colors" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                autoComplete="new-password" 
                required 
              />
              
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 pb-2">
                <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                  <input 
                    type="checkbox" 
                    className="accent-[#cca332] w-4 h-4 cursor-pointer" 
                    checked={rememberMe} 
                    onChange={e => setRememberMe(e.target.checked)} 
                  />
                  Remember Username
                </label>
                <span className="cursor-pointer hover:text-black font-semibold" onClick={() => setForgotStep(1)}>
                  Forgot Password?
                </span>
              </div>

              <button type="submit" className="w-full bg-[#cca332] text-white font-bold py-4 rounded hover:bg-black transition-all">LOGIN</button>
            </form>
          )}

          {forgotStep === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-6 animate-fade-in">
              <p className="text-xs text-center text-gray-500">Enter email to receive OTP</p>
              <input type="email" placeholder="Your Account Email" className="w-full bg-gray-50 border p-4 rounded outline-none focus:border-[#cca332]" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
              <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded hover:bg-[#cca332] transition-all">SEND OTP</button>
              <p className="text-center text-xs cursor-pointer text-gray-500 hover:text-black" onClick={() => setForgotStep(0)}>Back to Login</p>
            </form>
          )}

          {forgotStep === 2 && (
            <form onSubmit={handleVerifyOTPAndReset} className="space-y-6 animate-fade-in">
              <input type="text" placeholder="Enter 6-Digit OTP" className="w-full bg-gray-50 border p-4 rounded outline-none tracking-widest text-center font-bold focus:border-[#cca332]" value={otp} onChange={e => setOtp(e.target.value)} required />
              <input type="password" placeholder="Set New Password" className="w-full bg-gray-50 border p-4 rounded outline-none focus:border-[#cca332]" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              <button type="submit" className="w-full bg-[#cca332] text-white font-bold py-4 rounded hover:bg-black transition-all">RESET & LOGIN</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded shadow-sm">
          <h1 className="text-xl font-black tracking-widest uppercase">
            {userRole === 'superadmin' ? 'Super Admin Dashboard' : 'User Panel'}
          </h1>
          <button onClick={handleLogout} className="text-xs font-bold bg-black text-white px-6 py-2 rounded">LOGOUT</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded shadow-sm">
              <h3 className="font-bold mb-6 border-b pb-2 uppercase text-xs">New Package Listing</h3>
              
              <form onSubmit={handleAddPackage} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Package Title</label>
                    <input type="text" placeholder="e.g. 14 Nights | Economy..." className="w-full border p-3 rounded text-sm bg-gray-50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div>
                     <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Price ($)</label>
                     <input type="number" placeholder="420" className="w-full border p-3 rounded text-sm bg-gray-50" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Category</label>
                    <select className="w-full border p-3 rounded text-sm bg-gray-50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="popular">Popular</option><option value="premium">Premium</option><option value="economy">Economy</option><option value="group">Group</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Makkah Distance</label>
                    <input type="text" placeholder="e.g. 800 m" className="w-full border p-3 rounded text-sm bg-gray-50" value={formData.makkah} onChange={e => setFormData({...formData, makkah: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Madinah Distance</label>
                    <input type="text" placeholder="e.g. 500 m" className="w-full border p-3 rounded text-sm bg-gray-50" value={formData.madinah} onChange={e => setFormData({...formData, madinah: e.target.value})} required />
                  </div>
                </div>

                <div>
                   <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Route (Comma Separated)</label>
                   <input type="text" placeholder="JEDDAH, MAKKAH, MADINAH" className="w-full border p-3 rounded text-sm bg-gray-50" value={formData.route} onChange={e => setFormData({...formData, route: e.target.value})} required />
                </div>
                <div>
                   <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Inclusions (Comma Separated)</label>
                   <input type="text" placeholder="Visa, Hotel, Transport" className="w-full border p-3 rounded text-sm bg-gray-50" value={formData.inclusions} onChange={e => setFormData({...formData, inclusions: e.target.value})} required />
                </div>

                <button type="submit" className="w-full bg-[#cca332] text-white py-4 font-bold rounded">ADD PACKAGE</button>
              </form>
            </div>

            {userRole === 'superadmin' && (
              <div className="bg-white p-8 rounded shadow-sm border-t-4 border-black">
                <h3 className="font-bold mb-6 border-b pb-2 uppercase text-xs">Add System User</h3>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <input type="text" placeholder="Username" className="w-full border p-3 rounded text-sm bg-gray-50" value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} required />
                  <input type="email" placeholder="Email" className="w-full border p-3 rounded text-sm bg-gray-50" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} required />
                  <input type="password" placeholder="Password" className="w-full border p-3 rounded text-sm bg-gray-50" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} required />
                  <button type="submit" className="w-full bg-black text-white py-4 font-bold rounded hover:bg-gray-800 transition-all">CREATE USER</button>
                </form>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded shadow-sm overflow-x-auto h-fit">
               <h3 className="font-bold mb-6 border-b pb-2 uppercase text-xs">Active Packages</h3>
               <table className="w-full text-left text-sm divide-y">
                 <thead>
                   <tr className="text-[10px] text-gray-400 border-b">
                     <th className="pb-4">NAME</th>
                     <th className="pb-4">CATEGORY</th>
                     <th className="pb-4">PRICE</th>
                     <th className="pb-4 text-right">ACTION</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {packages.map(pkg => (
                     <tr key={pkg._id} className="hover:bg-gray-50">
                       <td className="py-4 font-medium">{pkg.title}</td>
                       <td className="py-4 uppercase text-[10px] text-gray-400 font-bold">{pkg.category}</td>
                       <td className="py-4 font-bold">${pkg.price}</td>
                       <td className="py-4 text-right"><button onClick={() => handleDeletePackage(pkg._id)} className="text-red-500 font-bold text-[10px] hover:underline">DELETE</button></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>

            {userRole === 'superadmin' && (
              <div className="bg-white p-8 rounded shadow-sm overflow-x-auto h-fit border-t-4 border-red-500">
                 <h3 className="font-bold mb-6 border-b pb-2 uppercase text-xs">Active Users (Sub-Admins)</h3>
                 <table className="w-full text-left text-sm">
                   <thead>
                     <tr className="text-[10px] text-gray-400 border-b">
                       <th className="pb-4">USERNAME</th>
                       <th className="pb-4">EMAIL</th>
                       <th className="pb-4">STATUS</th>
                       <th className="pb-4 text-right">ACTION</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y">
                     {subUsers.map(user => (
                       <tr key={user._id} className="hover:bg-gray-50">
                         <td className="py-4 font-bold text-gray-800">{user.username}</td>
                         <td className="py-4 text-gray-500 text-xs">{user.email}</td>
                         <td className="py-4">
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-full border border-green-200 uppercase tracking-widest">
                             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                             Active
                           </span>
                         </td>
                         <td className="py-4 text-right">
                           <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 font-bold text-[10px] hover:underline">REVOKE ACCESS</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;