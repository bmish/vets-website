// Node modules.
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Relative imports.
import MY_VA_LINK from '../constants/MY_VA_LINK';
import MegaMenu from '../components/MegaMenu';
import authenticatedUserLinkData from '../mega-menu-link-data-for-authenticated-users.json';
import recordEvent from '../../../monitoring/record-event';
import { isLoggedIn } from '../../../user/selectors';
import { replaceDomainsInData } from '../../../utilities/environment/stagingDomains';
import {
  toggleMobileDisplayHidden,
  togglePanelOpen,
  updateCurrentSection,
} from '../actions';

const tabbableSelectors =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function flagCurrentPageInTopLevelLinks(
  links = [],
  href = window.location.href,
  pathName = window.location.pathname,
) {
  return links.map(
    link =>
      pathName.endsWith(link.href) || href === link.href
        ? { ...link, currentPage: true }
        : link,
  );
}

export function getAuthorizedLinkData(
  loggedIn,
  defaultLinks,
  authenticatedLinks = authenticatedUserLinkData,
) {
  return [
    ...(defaultLinks ? replaceDomainsInData(defaultLinks) : []),
    ...(loggedIn ? replaceDomainsInData(authenticatedLinks) : []),
  ];
}

export class Main extends Component {
  static propTypes = {
    megaMenuData: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        menuSections: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      }).isRequired,
    ),
    toggleMobileDisplayHidden: PropTypes.func.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    updateCurrentSection: PropTypes.func.isRequired,
    // From mapStateToProps.
    currentDropdown: PropTypes.string,
    currentSection: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        menuSections: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        title: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    display: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    isMegaMenuMobileV2Enabled: PropTypes.bool,
  };

  toggleDropDown = currentDropdown => {
    const isVisible = !!currentDropdown;
    if (isVisible) {
      recordEvent({
        event: 'nav-header-top-level',
        'nav-header-action': `Navigation - Header - Open Top Level - ${currentDropdown}`,
      });
    }
    this.props.togglePanelOpen(currentDropdown);
  };

  updateCurrentSection = currentSection => {
    if (currentSection) {
      recordEvent({
        event: 'nav-header-second-level',
        'nav-header-action': `Navigation - Header - Open Second Level - ${currentSection}`,
      });
    }

    this.props.updateCurrentSection(currentSection);
  };

  linkClicked = link => {
    const linkName = link.text || link.title;
    recordEvent({
      event: 'nav-header-link',
      'nav-header-action': `Navigation - Header - Open Link - ${linkName}`,
    });
  };

  columnThreeLinkClicked = link => {
    recordEvent({
      event: 'nav-hub-containers',
      'nav-hub-action': link.text,
    });
  };

  toggleDisplayHidden = hidden => {
    this.props.toggleMobileDisplayHidden(hidden);
  };

  focusTrap = event => {
    const buttonContainer = document.getElementById('va-nav-controls');
    const megaMenuContainer = document.getElementById('mega-menu-mobile');
    const focusable = [
      ...Array.from(buttonContainer.querySelectorAll(tabbableSelectors)).filter(
        el =>
          el.getAttribute('tabindex') !== '-1' &&
          el.getAttribute('hidden') === null,
      ),
      ...Array.from(
        megaMenuContainer.querySelectorAll(tabbableSelectors),
      ).filter(
        el =>
          el.getAttribute('tabindex') !== '-1' &&
          el.getAttribute('hidden') === null,
      ),
    ];
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    if (event.code === 'Tab') {
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }
  };

  render() {
    const childProps = {
      ...this.props,
      toggleDisplayHidden: this.toggleDisplayHidden,
      toggleDropDown: this.toggleDropDown,
      updateCurrentSection: this.updateCurrentSection,
      linkClicked: this.linkClicked,
      columnThreeLinkClicked: this.columnThreeLinkClicked,
    };

    this.mobileMediaQuery = window.matchMedia('(max-width: 767px)');
    const megaMenuMobileContainer = document.getElementById('mega-menu-mobile');

    if (this.mobileMediaQuery.matches && megaMenuMobileContainer) {
      if (!this.props.display.hidden) {
        document.body.addEventListener('keydown', this.focusTrap);
      } else {
        document.body.removeEventListener('keydown', this.focusTrap);
      }

      return createPortal(
        <MegaMenu {...childProps} />,
        megaMenuMobileContainer,
      );
    }

    return <MegaMenu {...childProps} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const loggedIn = isLoggedIn(state);

  // Derive the default mega menu links (both auth + unauth).
  const defaultLinks = ownProps?.megaMenuData ? [...ownProps.megaMenuData] : [];

  defaultLinks.push(MY_VA_LINK);

  const data = flagCurrentPageInTopLevelLinks(
    getAuthorizedLinkData(loggedIn, defaultLinks),
  );

  return {
    currentDropdown: state.megaMenu?.currentDropdown,
    currentSection: state.megaMenu?.currentSection,
    data,
    display: state.megaMenu?.display,
    loggedIn,
  };
};

const mapDispatchToProps = {
  toggleMobileDisplayHidden,
  togglePanelOpen,
  updateCurrentSection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
