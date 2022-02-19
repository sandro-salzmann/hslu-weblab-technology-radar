import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container, Divider } from "semantic-ui-react";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ViewerPage } from "./pages/ViewerPage";

function App() {
  return (
    <BrowserRouter>
      <Container text>
        <Header />
        <Divider />
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
