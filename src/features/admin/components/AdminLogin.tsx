import { useState } from "react";
import { Lock, LogIn } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      setLoading(false);
      toast.error("E-mail ou senha incorretos");
      return;
    }
    // Verify admin role server-side via RLS-protected user_roles table
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!role) {
      await supabase.auth.signOut();
      setLoading(false);
      toast.error("Esta conta não tem acesso administrativo");
      return;
    }

    setLoading(false);
    onLogin();
    toast.success("Bem-vindo, administrador!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 container mx-auto px-4 max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Área Administrativa</h1>
          <p className="text-muted-foreground text-sm mt-2">Acesso restrito ao administrador</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            autoComplete="email"
            className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            autoComplete="current-password"
            className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" /> {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
