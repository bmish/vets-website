import React from 'react';

export default function StudentVeteranGroupModalContent() {
  return (
    <>
      <h3>Student Veteran group</h3>
      <p>Does this school have a student-led Veteran group on campus?</p>
      <p>
        If a school has a student Veterans group that’s not represented here,
        please notify us by email at{' '}
        <a
          title="224A.VBAVACO@va.gov"
          href="mailto: 224A.VBACO@va.gov?subject=Comparison Tool"
        >
          224A.VBAVACO@va.gov
        </a>
        . We update this information in the Comparison Tool quarterly.
      </p>
      <p>
        Please note this email address is only for Comparison Tool-related
        issues. For questions about your GI Bill benefits,{' '}
        <a
          href="https://gibill.custhelp.com/app/utils/login_form/redirect/ask"
          target="_blank"
          rel="noopener noreferrer"
        >
          please check this "Ask a Question" page
        </a>
        .
      </p>
    </>
  );
}
