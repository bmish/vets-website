// import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const toggleValues = async (feature = '') => {
  debugger;
  const response = await fetch(`http://localhost:3000/v0/feature_toggles?features=${feature}`, {
    credentials: 'include',
    headers: {
      'X-CSRF-Token': localStorage.getItem('csrfToken'),
    },
  });
  if (!response.ok) {
    const errorMessage = `Failed to fetch toggle values with status ${
      response.status
    } ${response.statusText}`;
    throw new Error(errorMessage);
  }

  // Get CSRF Token from API header
  const csrfToken = response.headers.get('X-CSRF-Token');

  if (csrfToken && csrfToken !== csrfTokenStored) {
    localStorage.setItem('csrfToken', csrfToken);
  }

  this.setState({[feature]: response})

  return response.json();
};

export const isProduction = state => toggleValues(state).production;
