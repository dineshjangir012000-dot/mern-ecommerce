import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
import axios from "axios";
import { toast } from 'sonner';
import { API_BASE_URL } from '../apihelper';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   email : "",
  //   password : ""
  // })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/logIn`, 
        {email , password }
      )
      console.log("response", res)

      if(!res.data.status){
        toast.error(res.data.message || "login failed")
        return
      }

      const user = res.data.data;
      if(user.role !== "ADMIN"){
        toast.error("You are not authorized as admin")
        return
      }

      localStorage.setItem("admintoken", res.data.token)
      localStorage.setItem("admin", JSON.stringify(user))

      navigate("/admin");
    } catch (error) {
      console.log("something went wrong")
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground">Demo credentials:</p>
            <p className="mt-1 text-sm text-foreground">
              Email: <code className="rounded bg-muted px-1">admin@example.com</code>
            </p>
            <p className="text-sm text-foreground">
              Password: <code className="rounded bg-muted px-1">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}