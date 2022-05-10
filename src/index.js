import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { Organization } from './features/organization/Organization';
import { Repositories } from './features/repositiories/Repositories';
import { Events } from './features/events/Events';
import { Hooks } from './features/hooks/Hooks';
import { Issues } from './features/issues/Issues';
import { Members } from './features/members/Members';
import { Member } from './features/member/Member';
import { Error } from './features/error/Error';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Organization />} />
          <Route path="/organizations/:id/repos" element={<Repositories />} />
          <Route path="/organizations/:id/events" element={<Events />} />
          <Route path="/organizations/:id/hooks" element={<Hooks />} />
          <Route path="/organizations/:id/issues" element={<Issues />} />
          <Route path="/organizations/:id/members" element={<Members />} />
          <Route path="/organizations/:id/members/:member" element={<Member />} />
          <Route path="*" element={<Error msg="Sorry, we coudln't find the page you are looking for :(" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
