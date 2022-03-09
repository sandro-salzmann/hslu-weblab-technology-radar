import { useAuth0 } from "@auth0/auth0-react";
import { TechnologyCategory } from "common";
import React, { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Divider, Icon, Message } from "semantic-ui-react";
import { EditTechnologyModal } from "./components/EditTechnologyModal";
import { Header } from "./components/Header";
import { TechnologyViewModal } from "./components/TechnologyViewModal";
import { AdminPage } from "./pages/AdminPage";
import { CategoryPage } from "./pages/CategoryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ViewerPage } from "./pages/ViewerPage";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const categories: TechnologyCategory[] = [
    "techniques",
    "platforms",
    "tools",
    "languages",
  ];

  return (
    <div style={{ maxWidth: 1500, margin: "0 auto", padding: 14 }}>
      <BrowserRouter>
        <Header />
        <Divider />
        {isLoading ? (
          "Loading auth data..."
        ) : (
          <Fragment>
            <EditTechnologyModal />
            <TechnologyViewModal />
            {!isAuthenticated && !isLoading && (
              <Message icon size="big" negative floating>
                <Icon name="warning" />
                <Message.Content>
                  <Message.Header>Login required.</Message.Header>
                  <p>Please login to access the application.</p>
                </Message.Content>
              </Message>
            )}
            <Routes>
              <Route path="" element={<ViewerPage />} />
              {categories.map((category) => (
                <Route
                  key={category}
                  path={`/${category}`}
                  element={<CategoryPage category={category} />}
                />
              ))}
              <Route path="admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Fragment>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
