// CustomPage.jsx
import React from 'react';

const Vet1Review = ({ data, editPage }) => (
  <>
    <pre>{JSON.stringify(data, null, 2)}</pre>
    <button onClick={editPage}>Edit</button>
  </>
);

export default Vet1Review;
