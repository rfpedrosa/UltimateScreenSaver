import App from "./App";
import { MemoryRouter } from "react-router";
import React from "react";
import { mount } from "enzyme";

describe("App", () => {
  it("renders", () => {
    const component = mount(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    component.unmount();
  });
});
