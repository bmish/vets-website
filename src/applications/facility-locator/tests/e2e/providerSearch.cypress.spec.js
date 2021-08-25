import mockFacilityDataV1 from '../../constants/mock-facility-data-v1.json';
import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import { facilityTypes, urgentCareServices } from '../../config.js';
import { LocationType } from '../../constants';

describe('Provider search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', []);
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.intercept('GET', '/v1/facilities/va?*', mockFacilityDataV1).as(
      'searchFacilities',
    );
    cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
  });

  it('finds community dentists', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select(
      facilityTypes[LocationType.CC_PROVIDER],
    );
    cy.get('#service-type-ahead-input').type('Dentist');
    cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      `Results for "${
        facilityTypes[LocationType.CC_PROVIDER]
      }", "Dentist - Orofacial Pain " near "Austin, Texas"`,
    );
    cy.get('#other-tools').should('exist');

    cy.axeCheck();

    cy.get('.facility-result h3').contains('BADEA, LUANA');

    cy.get('.va-pagination').should('not.exist');
  });

  it('finds community urgent care - Clinic/Center', () => {
    cy.visit('/find-locations');
    cy.injectAxe();

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select(
      facilityTypes[LocationType.CC_PROVIDER],
    );
    cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent Care');
    cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      `Results for "${
        facilityTypes[LocationType.CC_PROVIDER]
      }", "Clinic/Center - Urgent Care" near "Austin, Texas"`,
    );
    cy.get('#other-tools').should('exist');

    cy.axeCheck();

    cy.get('.facility-result h3').contains('Concentra Urgent Care');
    cy.get('.va-pagination').should('not.exist');
  });

  it('finds community urgent care', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin, TX');
    cy.get('#facility-type-dropdown').select('Urgent care');
    cy.get('#service-type-dropdown').select(urgentCareServices.NonVAUrgentCare);
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      `Results for "Urgent care", "${
        urgentCareServices.NonVAUrgentCare
      }" near "Austin, Texas"`,
    );
    cy.get('#other-tools').should('exist');

    cy.injectAxe();
    cy.axeCheck();

    cy.get('.facility-result h3').contains('MinuteClinic');
    cy.get('.va-pagination').should('not.exist');
  });

  it('finds In-network community emergency care', () => {
    cy.visit('/find-locations');

    cy.get('#street-city-state-zip').type('Austin');
    cy.get('#facility-type-dropdown').select('Emergency care');
    cy.get('#service-type-dropdown').select(
      'In-network community emergency care',
    );
    cy.get('#facility-search').click({ waitForAnimations: true });
    cy.get('#search-results-subheader').contains(
      'Results for "Emergency Care", "In-network community emergency care" near "Austin, Texas"',
    );
    cy.get('.search-result-emergency-care-subheader').should('exist');
    cy.get('.facility-result h3').contains('DELL SETON MEDICAL CENTER AT UT');

    cy.injectAxe();
    cy.axeCheck();
  });
});
