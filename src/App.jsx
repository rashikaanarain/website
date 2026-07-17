import { AdminApp } from "./admin/AdminApp.jsx";
import { HomePage } from "./site/HomePage.jsx";

export default function App() {
  return window.location.pathname.startsWith("/admin") ? <AdminApp /> : <HomePage />;
}
