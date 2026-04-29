import { useState } from "react";
import { Lock, LogIn } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const ADMIN_USER = "admin";
const ADMIN_PASS = "seujota2024";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem("admin_auth", "true");
      onLogin();
      toast.success("Bem-vindo, administrador!");
    } else {
      toast.error("Usuário ou senha incorretos");
    }
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
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
            className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <LogIn className="h-4 w-4" /> Entrar
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
