import Login from "./Login";
import React from "react";
import { shallow } from "enzyme";

describe('Login', () => {
  it('insufficient password', () => {
    const wrapper = shallow(<Login />);
    
    wrapper.setState({ email: 'a@example.com', password: '123456a' });
    var component = wrapper.instance();
    expect(component.validateForm()).toBeFalsy();
  });

  it('sufficient password', () => {
    const wrapper = shallow(<Login />);
    
    wrapper.setState({ email: 'a@example.com', password: '123456ab' });
    var component = wrapper.instance();
    expect(component.validateForm()).toBeTruthy();
  });
});