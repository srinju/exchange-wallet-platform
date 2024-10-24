"use client"
import Link from 'next/link';
import React, { useState } from 'react'

const Signup = () => {
    const[user,serUser] = useState(null);
    const [error,setError] = useState('');
    const [success , setSuccess] = useState('');
    const [formData , setFormData] = useState({
        email : '',
        password : '',
        name : '',
        number : ''
    });
    const handleChange = (e : any) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };
    const handleSubmit = async (e : any) => {
        e.prevent.default();
        setError('');
        setSuccess('');
        try {
            const res = await fetch("/api/Signup",{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(formData),
            });
            if(!res.ok){
                const errorResponse = await res.text();
                throw new Error(errorResponse || "an unknown error occured");
            }
            const data = await res.json();
            console.log('user created',data);
            serUser(data.user);
        } catch (error) {
            console.error('error occured during signup' , error);
            setError('an error occured during signup');
        }
    }
  return (
    <div>
        <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-slate-950">
          <h1 className="text-3xl font-bold text-center mb-5 text-slate-50">Sign up</h1>
          <p className="text-center mb-4 text-slate-50">Please enter your details.</p>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-slate-50">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border text-black border-gray-300 rounded"
                  placeholder="ex: John"
                  required
                />
              </div>             
            </div>
            <div>
              <label className="block text-slate-50">Number</label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full p-2 border text-black border-gray-300 rounded"
                placeholder="ex: 1234"
                required
              />
            </div>
            <div>
              <label className="block text-slate-50">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-slate-50">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
            >
              Sign up
            </button>
          </form>
          
          <p className="text-center mt-4 text-slate-50">
            Already have an account? <Link href="/api/auth/signin" className="text-green-500">Login</Link>
          </p>
        </div>
    </div>
  )
}

export default Signup