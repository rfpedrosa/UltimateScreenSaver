import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import HomePage from "./containers/Home";
import NotFoundPage from "./containers/NotFound";
import './App.css';
import App from './App';

describe('Routes', () => {
  it('invalid path should redirect to 404', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <App />
      </MemoryRouter>
    );
    expect(wrapper.find(HomePage)).toHaveLength(0);
    expect(wrapper.find(NotFoundPage)).toHaveLength(1);
    wrapper.unmount();
  });

  it('valid path should not redirect to 404', () => {
    const wrapper = mount(
      <MemoryRouter path="/" initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(wrapper.find(HomePage)).toHaveLength(1);
    expect(wrapper.find(NotFoundPage)).toHaveLength(0);
    wrapper.unmount();
  });
});