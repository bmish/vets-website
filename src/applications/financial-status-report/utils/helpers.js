import moment from 'moment';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const fsrWizardFeatureToggle = state => {
  return toggleValues(state)[
    FEATURE_FLAG_NAMES.showFinancialStatusReportWizard
  ];
};

export const fsrFeatureToggle = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.showFinancialStatusReport];
};

export const allEqual = arr => arr.every(val => val === arr[0]);

export const dateFormatter = date => {
  if (!date) return undefined;
  const formatDate = date?.slice(0, -3);
  return moment(formatDate, 'YYYY-MM').format('MM/YYYY');
};

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(parseFloat(amount));
};

const hasProperty = (arr, key) => {
  return arr.filter(item => item[key]).length > 0 ?? false;
};

export const sumValues = (arr, key) => {
  const isValid = Array.isArray(arr) && arr.length && hasProperty(arr, key);
  if (!isValid) return 0;
  return arr.reduce((acc, item) => acc + (Number(item[key]) ?? 0), 0);
};

export const filterDeductions = (deductions, filters) => {
  if (!deductions.length) return 0;
  return deductions
    .filter(({ name }) => filters.includes(name))
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
};

export const otherDeductionsName = (deductions, filters) => {
  if (!deductions.length) return '';
  return deductions
    .filter(({ name }) => !filters.includes(name))
    .map(({ name }) => name)
    .join(', ');
};

export const otherDeductionsAmt = (deductions, filters) => {
  if (!deductions.length) return 0;
  return deductions
    .filter(({ name }) => name && !filters.includes(name))
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
};

export const nameStr = (socialSecurity, compensation, education, addlInc) => {
  const benefitTypes = [];
  if (socialSecurity) {
    benefitTypes.push('Social Security');
  }
  if (compensation) {
    benefitTypes.push('Disability Compensation');
  }
  if (education) {
    benefitTypes.push('Education');
  }
  const vetAddlNames = addlInc?.map(({ name }) => name) ?? [];
  const otherIncNames = [...benefitTypes, ...vetAddlNames];

  return otherIncNames?.map(item => item).join(', ') ?? '';
};

export const getFsrReason = debts => {
  const reasons = debts.map(({ resolution }) => resolution.resolutionType);
  const uniqReasons = [...new Set(reasons)];

  return uniqReasons.join(', ');
};

export const getMonthlyIncome = ({
  additionalIncome: {
    addlIncRecords,
    spouse: { spAddlIncome },
  },
  socialSecurity,
  benefits,
  currEmployment,
  spCurrEmployment,
  income,
}) => {
  // deduction filters
  const taxFilters = ['State tax', 'Federal tax', 'Local tax'];
  const retirementFilters = ['401K', 'IRA', 'Pension'];
  const socialSecFilters = ['FICA (Social Security and Medicare)'];
  const allFilters = [...taxFilters, ...retirementFilters, ...socialSecFilters];

  // veteran
  const vetGrossSalary = sumValues(currEmployment, 'veteranGrossSalary');
  const vetAddlInc = sumValues(addlIncRecords, 'amount');
  const vetSocSecAmt = Number(socialSecurity.socialSecAmt ?? 0);
  const vetComp = sumValues(income, 'compensationAndPension');
  const vetEdu = sumValues(income, 'education');
  const vetBenefits = vetComp + vetEdu;
  const vetDeductions = currEmployment?.map(emp => emp.deductions).flat() ?? 0;
  const vetTaxes = filterDeductions(vetDeductions, taxFilters);
  const vetRetirement = filterDeductions(vetDeductions, retirementFilters);
  const vetSocialSec = filterDeductions(vetDeductions, socialSecFilters);
  const vetOther = otherDeductionsAmt(vetDeductions, allFilters);
  const vetTotDeductions = vetTaxes + vetRetirement + vetSocialSec + vetOther;
  const vetOtherIncome = vetAddlInc + vetBenefits + vetSocSecAmt;
  const vetNetIncome = vetGrossSalary - vetTotDeductions;

  // spouse
  const spGrossSalary = sumValues(spCurrEmployment, 'spouseGrossSalary');
  const spAddlInc = sumValues(spAddlIncome, 'amount');
  const spSocialSecAmt = Number(socialSecurity.socialSecAmt ?? 0);
  const spComp = Number(benefits.spouseBenefits.compensationAndPension ?? 0);
  const spEdu = Number(benefits.spouseBenefits.education ?? 0);
  const spBenefits = spComp + spEdu;
  const spDeductions = spCurrEmployment?.map(emp => emp.deductions).flat() ?? 0;
  const spTaxes = filterDeductions(spDeductions, taxFilters);
  const spRetirement = filterDeductions(spDeductions, retirementFilters);
  const spSocialSec = filterDeductions(spDeductions, socialSecFilters);
  const spOtherAmt = otherDeductionsAmt(spDeductions, allFilters);
  const spTotDeductions = spTaxes + spRetirement + spSocialSec + spOtherAmt;
  const spOtherIncome = spAddlInc + spBenefits + spSocialSecAmt;
  const spNetIncome = spGrossSalary - spTotDeductions;

  return vetNetIncome + vetOtherIncome + spNetIncome + spOtherIncome;
};

export const getMonthlyExpenses = ({
  expenses,
  otherExpenses,
  utilityRecords,
  installmentContracts,
}) => {
  const utilities = sumValues(utilityRecords, 'monthlyUtilityAmount');
  const installments = sumValues(installmentContracts, 'amountDueMonthly');
  const otherExp = sumValues(otherExpenses, 'amount');
  const expVals = Object.values(expenses).filter(Boolean);
  const totalExp = expVals.reduce((acc, expense) => acc + Number(expense), 0);

  return utilities + installments + otherExp + totalExp;
};

export const getTotalAssets = ({ assets, realEstateRecords }) => {
  const totOtherAssets = sumValues(assets.otherAssets, 'amount');
  const totRecVehicles = sumValues(assets.recVehicles, 'recVehicleAmount');
  const totVehicles = sumValues(assets.automobiles, 'resaleValue');
  const realEstate = sumValues(realEstateRecords, 'realEstateAmount');
  const totAssets = Object.values(assets)
    .filter(item => item && !Array.isArray(item))
    .reduce((acc, amount) => acc + Number(amount), 0);

  return totVehicles + totRecVehicles + totOtherAssets + realEstate + totAssets;
};

export const getEmploymentHistory = ({ questions, personalData }) => {
  const { employmentHistory } = personalData;
  let history = [];

  const defaultObj = {
    veteranOrSpouse: '',
    occupationName: '',
    from: '',
    to: '',
    present: false,
    employerName: '',
    employerAddress: {
      addresslineOne: '',
      addresslineTwo: '',
      addresslineThree: '',
      city: '',
      stateOrProvince: '',
      zipOrPostalCode: '',
      countryName: '',
    },
  };

  if (questions.vetIsEmployed) {
    const { employmentRecords } = employmentHistory.veteran;
    const vetEmploymentHistory = employmentRecords.map(employment => ({
      ...defaultObj,
      veteranOrSpouse: 'VETERAN',
      occupationName: employment.type,
      from: dateFormatter(employment.from),
      to: employment.isCurrent ? '' : dateFormatter(employment.to),
      present: employment.isCurrent ? employment.isCurrent : false,
      employerName: employment.employerName,
    }));
    history = [...history, ...vetEmploymentHistory];
  }

  if (questions.spouseIsEmployed) {
    const { employmentRecords } = employmentHistory.spouse;
    const spouseEmploymentHistory = employmentRecords.map(employment => ({
      ...defaultObj,
      veteranOrSpouse: 'SPOUSE',
      occupationName: employment.type,
      from: dateFormatter(employment.from),
      to: employment.isCurrent ? '' : dateFormatter(employment.to),
      present: employment.isCurrent ? employment.isCurrent : false,
      employerName: employment.employerName,
    }));
    history = [...history, ...spouseEmploymentHistory];
  }

  return history;
};
