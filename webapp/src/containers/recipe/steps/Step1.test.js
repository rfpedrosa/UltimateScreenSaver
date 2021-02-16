import Step1 from "./Step1";
import React from "react";
import { shallow } from "enzyme";

describe('Step1', () => {
  const props = {
    recipe: () => {
      return {
        title: '',
      }
    },
  }

  it('title only with spaces', () => {
    const wrapper = shallow(<Step1 {...props} />);

    wrapper.setState({ title: '    ' });
    var component = wrapper.instance();
    expect(component.isTitleValid()).toBeFalsy();
  });

  it('title too big', () => {
    const wrapper = shallow(<Step1 {...props} />);

    wrapper.setState({ title: '1234567891234567891234567891234' });
    var component = wrapper.instance();
    expect(component.isTitleValid()).toBeFalsy();
  });

  it('title ok', () => {
    const wrapper = shallow(<Step1 {...props} />);

    wrapper.setState({ title: '    my recipe    ' });
    var component = wrapper.instance();
    expect(component.isTitleValid()).toBeTruthy();
  });

});
