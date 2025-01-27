import React from 'react';
import PropTypes from 'prop-types';
import SubMenu from './SubMenu';
import _ from 'lodash';

class MenuSection extends React.Component {
  constructor() {
    super();

    this.state = {
      title: {},
    };
  }

  getCurrentSection() {
    return this.props.currentSection
      ? this.props.currentSection
      : this.props.defaultSection;
  }

  getId(title) {
    return `vetnav-${_.kebabCase(title)}-ms`;
  }

  updateCurrentSection() {
    if (this.props.mobileMediaQuery.matches) {
      this.setState({
        title: {
          hidden: true,
        },
      });
    }

    this.props.updateCurrentSection();
  }

  handleBackToMenu() {
    this.updateCurrentSection('');

    if (this.props.mobileMediaQuery.matches) {
      this.setState({
        title: {},
      });
    }
  }

  render() {
    const {
      columnThreeLinkClicked,
      href,
      linkClicked,
      links,
      mobileMediaQuery,
      smallDesktopMediaQuery,
      title,
    } = this.props;

    const currentSection = this.getCurrentSection(this.props);
    const show = currentSection === title;
    const isPlainLink = !!href;

    let button = null;
    let submenu = null;

    if (isPlainLink) {
      button = (
        <a
          className="vetnav-level2"
          data-e2e-id={`vetnav-level2--${_.kebabCase(title)}`}
          href={href}
          onClick={linkClicked}
          tabIndex={currentSection && !show ? -1 : undefined}
        >
          {title}
        </a>
      );
    } else {
      button = (
        <button
          {...this.state.title}
          aria-controls={show ? this.getId(title) : null}
          aria-expanded={show}
          className="vetnav-level2"
          data-e2e-id={`vetnav-level2--${_.kebabCase(title)}`}
          onClick={() => this.updateCurrentSection()}
          tabIndex={currentSection && !show ? -1 : undefined}
        >
          {title}
        </button>
      );

      submenu = (
        <SubMenu
          id={this.getId(title)}
          data={links}
          navTitle={title}
          show={show}
          handleBackToMenu={() => this.handleBackToMenu()}
          linkClicked={linkClicked}
          mobileMediaQuery={mobileMediaQuery}
          smallDesktopMediaQuery={smallDesktopMediaQuery}
          columnThreeLinkClicked={columnThreeLinkClicked}
        />
      );
    }

    return (
      <li
        className={`mm-link-container${
          this.state.title.hidden ? '-small' : ''
        }`}
      >
        {button}
        {submenu}
      </li>
    );
  }
}

MenuSection.propTypes = {
  title: PropTypes.string.isRequired,
  updateCurrentSection: PropTypes.func.isRequired,
  links: PropTypes.shape({
    columnOne: PropTypes.shape({
      title: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
        }),
      ),
    }),
    columnTwo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
        }),
      ),
    }),
    columnThree: PropTypes.shape({
      img: PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
      }),
      link: PropTypes.shape({
        href: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      }),
      description: PropTypes.string.isRequired,
    }),
    seeAllLink: PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  }),
  href: PropTypes.string,
  defaultSection: PropTypes.string.isRequired,
  linkClicked: PropTypes.func.isRequired,
  columnThreeLinkClicked: PropTypes.func.isRequired,
};

export default MenuSection;
