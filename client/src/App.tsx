import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import AddItem from "@/pages/AddItem";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddItem />} />
      </Routes>
    </BrowserRouter>
  );
}
