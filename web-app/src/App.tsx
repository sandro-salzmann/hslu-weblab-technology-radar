import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { ViewerPage } from "./pages/ViewerPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Container text>
        <Header />
        <Routes>
          <Route path="" element={<ViewerPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
