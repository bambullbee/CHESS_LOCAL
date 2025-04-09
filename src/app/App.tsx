import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/widgets/Layout";
import { NewGame } from "@/pages/NewGame";
import { CurrentGame } from "@/pages/CurrentGame";
import { Games } from "@/pages/Games";
import { Leaderboard } from "@/pages/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NewGame />} />
          <Route path="games" element={<Games />} />
          <Route path="games/:id" element={<CurrentGame />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
