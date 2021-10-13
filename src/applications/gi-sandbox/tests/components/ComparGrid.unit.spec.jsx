import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CompareGrid from '../../components/CompareGrid';

describe('<CompareGrid>', () => {
  it('should render', () => {
    const tree = shallow(<CompareGrid institutions={[]} fieldData={[]} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should render', () => {
    const tree = shallow(
      <CompareGrid
        institutions={[
          {
            name: 'Institution A',
            testValue: 'AAA',
          },
          {
            name: 'Institution B',
            testValue: 'BBB',
          },
        ]}
        fieldData={[
          {
            label: 'Test Field',
            mapper: institution => institution.testValue,
          },
        ]}
      />,
    );
    expect(tree.find('.field-label').length).to.eq(1);
    expect(tree.find('.field-value').length).to.eq(2);
    expect(tree.find('.field-label').text()).to.eq('Test Field');
    expect(
      tree
        .find('.field-value')
        .at(0)
        .text(),
    ).to.eq('AAA');
    expect(
      tree
        .find('.field-value')
        .at(1)
        .text(),
    ).to.eq('BBB');
    tree.unmount();
  });
});
