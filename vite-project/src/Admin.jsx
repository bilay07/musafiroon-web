import React, { useState, useEffect } from 'react';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Nayi States ---
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [adminForm, setAdminForm] = useState({ username: '', email: '', password: '' });

  // Form states
  const [formData, setFormData] = useState({
    title: '', price: '', category: 'popular',
    route: 'MAKKAH, MADINAH', inclusions: 'Visa, Hotel, Transport',
    makkah: '', madinah: ''
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchPackages();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://musafiroon-web.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        fetchPackages();
      } else {
        alert("Invalid Access!");
      }
    } catch (err) {
      alert("Server Error!");
    }
  };

  // --- FORGOT PASSWORD FUNCTION ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetEmail !== 'mosafiroon.info@gmail.com') {
      alert("Unauthorized! Sirf main admin email allowed hai.");
      return;
    }
    try {
      const res = await fetch('https://musafiroon-web.onrender.com/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password Reset Successful! Ab naye password se login karein.");
        setShowForgot(false);
        setResetEmail('');
        setNewPassword('');
      } else {
        alert(data.message || "Reset failed!");
      }
    } catch (err) {
      alert("Server Error!");
    }
  };

  // --- ADD NEW USER FUNCTION ---
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://musafiroon-web.onrender.com/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(adminForm)
      });
      const data = await res.json();
      if (data.success) {
        alert("New User Added Successfully!");
        setAdminForm({ username: '', email: '', password: '' });
      } else {
        alert(data.message || "Failed to add user!");
      }
    } catch (err) {
       alert("Server Error!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    window.location.reload(); 
  };

  const fetchPackages = () => {
    fetch('https://musafiroon-web.onrender.com/api/packages')
      .then(res => res.json())
      .then(data => { setPackages(data); setLoading(false); });
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    const newPkg = {
      title: formData.title,
      price: Number(formData.price),
      category: formData.category,
      route: formData.route.split(',').map(s => s.trim()),
      inclusions: formData.inclusions.split(',').map(s => s.trim()),
      distances: { makkah: formData.makkah, madinah: formData.madinah }
    };

    try {
      const response = await fetch('https://musafiroon-web.onrender.com/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newPkg)
      });
      if(response.ok) { fetchPackages(); setFormData({title:'', price:'', category:'popular', route:'MAKKAH, MADINAH', inclusions:'Visa, Hotel, Transport', makkah:'', madinah:''}); }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Confirm Delete?")) {
      await fetch(`https://musafiroon-web.onrender.com/api/packages/${id}`, { 
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPackages();
    }
  };

  // --- LOGIN & FORGOT UI ---
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-sm border-b-8 border-[#cca332]">
          <h2 className="text-2xl font-black text-center mb-8 tracking-tighter text-gray-800 uppercase">
            {showForgot ? "Reset Password" : "Secure Access"}
          </h2>
          
          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
              <input 
                type="text" placeholder="Username / Email" 
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded outline-none focus:border-[#cca332] transition-all"
                value={identifier} onChange={(e) => setIdentifier(e.target.value)} required
              />
              <input 
                type="password" placeholder="Password" 
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded outline-none focus:border-[#cca332] transition-all"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
              <button type="submit" className="w-full bg-[#cca332] text-white font-bold py-4 rounded hover:bg-black transition-all duration-300">
                LOGIN
              </button>
              <p className="text-center mt-4 text-xs font-semibold cursor-pointer text-gray-500 hover:text-[#cca332] transition-colors" onClick={() => setShowForgot(true)}>
                Forgot Password?
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6 animate-fade-in">
              <input 
                type="email" placeholder="Main Admin Email" 
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded outline-none focus:border-[#cca332] transition-all"
                value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required
              />
              <input 
                type="password" placeholder="Set New Password" 
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded outline-none focus:border-[#cca332] transition-all"
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
              />
              <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded hover:bg-[#cca332] transition-all duration-300">
                UPDATE PASSWORD
              </button>
              <p className="text-center mt-4 text-xs font-semibold cursor-pointer text-gray-500 hover:text-black transition-colors" onClick={() => setShowForgot(false)}>
                Back to Login
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded shadow-sm">
          <h1 className="text-xl font-black tracking-widest uppercase">Admin Inventory</h1>
          <button onClick={handleLogout} className="text-xs font-bold bg-black text-white px-6 py-2 rounded">LOGOUT</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE: Forms Stacked */}
          <div className="lg:col-span-4 space-y-8">
            {/* 1. Add Package Form */}
            <div className="bg-white p-8 rounded shadow-sm">
              <h3 className="font-bold mb-6 border-b pb-2 uppercase text-xs">New Listing</h3>
              <form onSubmit={handleAddPackage} className="space-y-4">
                <input type="text" placeholder="Package Title" className="w-full border p-3 rounded bg-gray-50 text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <input type="number" placeholder="Price" className="w-full border p-3 rounded bg-gray-50 text-sm" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                <select className="w-full border p-3 rounded bg-gray-50 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="popular">Popular</option>
                  <option value="premium">Premium</option>
                  <option value="economy">Economy</option>
                  <option value="group">Group</option>
                </select>
                <button type="submit" className="w-full bg-[#cca332] text-white py-4 font-bold rounded shadow-lg">ADD PACKAGE</button>
              </form>
            </div>

            {/* 2. Add New User Form */}
            <div className="bg-white p-8 rounded shadow-sm border-t-4 border-black">
              <h3 className="font-bold mb-6 border-b pb-2 uppercase text-xs">Add System User</h3>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <input type="text" placeholder="Username" className="w-full border p-3 rounded bg-gray-50 text-sm" value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} required />
                <input type="email" placeholder="Email" className="w-full border p-3 rounded bg-gray-50 text-sm" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} required />
                <input type="password" placeholder="Password" className="w-full border p-3 rounded bg-gray-50 text-sm" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} required />
                <button type="submit" className="w-full bg-black hover:bg-gray-800 transition-colors text-white py-4 font-bold rounded shadow-lg">CREATE USER</button>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE: List */}
          <div className="lg:col-span-8 bg-white p-8 rounded shadow-sm overflow-x-auto h-fit">
             <h3 className="font-bold mb-6 border-b pb-2 uppercase text-xs">Active Packages</h3>
             <table className="w-full text-left">
               <thead>
                 <tr className="text-[10px] text-gray-400 border-b">
                   <th className="pb-4">NAME</th>
                   <th className="pb-4">CATEGORY</th>
                   <th className="pb-4">PRICE</th>
                   <th className="pb-4 text-right">ACTION</th>
                 </tr>
               </thead>
               <tbody className="text-sm divide-y">
                 {packages.map(pkg => (
                   <tr key={pkg._id} className="hover:bg-gray-50">
                     <td className="py-4 font-medium">{pkg.title}</td>
                     <td className="py-4 uppercase text-[10px] font-bold text-gray-400">{pkg.category}</td>
                     <td className="py-4 font-bold">${pkg.price}</td>
                     <td className="py-4 text-right">
                       <button onClick={() => handleDelete(pkg._id)} className="text-red-500 font-bold text-[10px]">DELETE</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;