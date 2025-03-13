import './App.css';
import ScrollToTop from './components/ScrollToTop';
import DefaultLayout from './layouts/DefaultLayout/index,';
import { Routes, Route } from 'react-router-dom'
import { publicRoutes } from "./routes/route";
import { Fragment } from 'react';
import DefaultAdminLayout from './layouts/components/admin/DefaultAdminLayout';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {publicRoutes.map(
          (item, index) => {
            var Page = item.page;
            var Layout = DefaultLayout;
            if (item.layout) {
              Layout = item.layout;
            }
            else if (item.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                index={index}
                path={item.path}
                element={<Layout><Page /></Layout>}
              />
            );
          }
        )}
      </Routes>
    </>
  );
}

export default App;
