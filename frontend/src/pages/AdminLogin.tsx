import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api.adminLogin(email, password);

            // Save token and info
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data));

            toast({ title: 'Success', description: 'Welcome to Super Admin Dashboard' });
            navigate('/admin');
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message || 'Login failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleFillDemo = () => {
        setEmail('admin@staybuddy.com');
        setPassword('admin123');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
                {/* Return home link */}
                <div className="mb-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to public website</span>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-8">
                    {/* Header */}
                    <div className="text-center space-y-2 mb-8">
                        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">StayBD Admin Portal</h2>
                        <p className="text-xs text-slate-500 font-medium">National Hospitality Oversight & Platform Command</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Admin Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="admin@staybuddy.com" 
                                    required 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Security Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Enter your security password" 
                                    required 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Quick Demo Fill Helper */}
                        <div className="pt-1 flex items-center justify-between text-xs">
                            <button
                                type="button"
                                onClick={handleFillDemo}
                                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Fill Admin Credentials</span>
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-indigo-600/20 active:scale-98 flex items-center justify-center gap-2 text-xs md:text-sm mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Verifying Credentials...</span>
                                </>
                            ) : (
                                <span>Sign In to Super Admin</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                        <p className="text-[11px] text-slate-400 font-medium">
                            Authorized personnel only · StayBD Platform 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
