import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  fetchNameAutocompleteSuggestions,
  fetchSearchByNameResults,
  updateAutocompleteName,
} from '../../actions';
import KeywordSearch from '../../components/search/KeywordSearch';
import { updateUrlParams } from '../../selectors/search';
import { useHistory } from 'react-router-dom';
import { TABS } from '../../constants';
import recordEvent from 'platform/monitoring/record-event';

export function NameSearchForm({
  autocomplete,
  dispatchFetchNameAutocompleteSuggestions,
  dispatchFetchSearchByNameResults,
  dispatchUpdateAutocompleteName,
  filters,
  preview,
  search,
}) {
  const { version } = preview;
  const [name, setName] = useState(search.query.name);
  const [error, setError] = useState(null);
  const history = useHistory();

  const doSearch = value => {
    dispatchFetchSearchByNameResults(value, 1, filters, version);

    updateUrlParams(
      history,
      search.tab,
      {
        ...search.query,
        name: value,
      },
      filters,
      version,
    );
  };

  /**
   * Triggers a search for search form when the "Update results" button in "Filter your results"
   * is clicked
   */
  useEffect(
    () => {
      if (!search.loadFromUrl && filters.search && search.tab === TABS.name) {
        doSearch(search.query.name || name);
      }
    },
    [filters.search],
  );

  useEffect(
    () => {
      if (
        search.loadFromUrl &&
        search.query.name !== null &&
        search.query.name !== ''
      ) {
        doSearch(search.query.name);
      }
    },
    [search.loadFromUrl],
  );

  const validateSearchTerm = searchTerm => {
    const empty = searchTerm.trim() === '';
    if (empty) {
      setError('Please fill in a school, employer, or training provider.');
    } else if (error !== null) {
      setError(null);
    }
    return !empty;
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (validateSearchTerm(name)) {
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': 'nameSearch',
        'gibct-form-value': name,
      });
      doSearch(name);
    }
  };

  const doAutocompleteSuggestionsSearch = value => {
    dispatchFetchNameAutocompleteSuggestions(
      value,
      {
        category: filters.category,
      },
      version,
    );
  };

  const onUpdateAutocompleteSearchTerm = value => {
    setName(value);
    dispatchUpdateAutocompleteName(value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-u-flex--1 medium-screen:vads-u-width--auto">
            <KeywordSearch
              className="name-search"
              error={error}
              inputValue={name}
              label="School, employer, or training provider"
              onFetchAutocompleteSuggestions={doAutocompleteSuggestionsSearch}
              onPressEnter={e => handleSubmit(e)}
              onSelection={s => setName(s.label)}
              onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
              suggestions={[...autocomplete.nameSuggestions]}
              validateSearchTerm={validateSearchTerm}
              version={version}
            />
          </div>
          <div className="vads-l-col--12 medium-screen:vads-u-flex--auto medium-screen:vads-u-width--auto name-search-button-container">
            <button
              className="usa-button vads-u-margin--0 vads-u-width--full find-form-button medium-screen:vads-u-width--auto name-search-button"
              type="submit"
            >
              <i
                aria-hidden="true"
                className="fas fa-search vads-u-margin-right--0p5"
                role="presentation"
              />
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  filters: state.filters,
  preview: state.preview,
  search: state.search,
});

const mapDispatchToProps = {
  dispatchFetchNameAutocompleteSuggestions: fetchNameAutocompleteSuggestions,
  dispatchUpdateAutocompleteName: updateAutocompleteName,
  dispatchFetchSearchByNameResults: fetchSearchByNameResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameSearchForm);
