// CustomPage.jsx
import React from 'react';

const CustomPageReview = ({ data, editPage }) => (
  <>
    <pre>{JSON.stringify(data, null, 2)}</pre>
    <button onClick={editPage}>Edit</button>
  </>
);

export default CustomPageReview;
