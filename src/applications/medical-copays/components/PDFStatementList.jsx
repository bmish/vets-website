import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import DownloadStatements from './DownloadStatement';

const PDFStatementList = () => {
  const { pathname } = useLocation();
  const selectedId = pathname.replace('/balance-details/', '');
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const statements = useSelector(({ mcp }) => mcp.statements);

  // get selected statement
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);
  // get facility  number on selected statement
  const facilityNumber = selectedCopay?.pSFacilityNum;
  // filter out all statements that are not related to this facility
  const facilityCopays = statements?.filter(
    ({ pSFacilityNum }) => pSFacilityNum === facilityNumber,
  );
  const fullName = userFullName.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  return (
    <section data-testid="download-statements">
      <h2 id="download-statements">Download your statements</h2>
      <p>
        Download your mailed statements for this facility from the past 6
        months.
      </p>

      {facilityCopays.map(statement => (
        <DownloadStatements
          key={statement.id}
          statementId={statement.id}
          statementDate={statement.pSStatementDate}
          fullName={fullName}
        />
      ))}
    </section>
  );
};

export default PDFStatementList;
