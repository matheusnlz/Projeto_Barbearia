import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Servicos from "@/pages/Servicos";
import Agendar from "@/pages/Agendar";
import Contato from "@/pages/Contato";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/servicos" element={<Servicos />} />
    <Route path="/agendar" element={<Agendar />} />
    <Route path="/contato" element={<Contato />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
