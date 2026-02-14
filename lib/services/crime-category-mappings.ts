// Crime Code to Category Mappings
// Based on LAPD crime codes and NIBRS offense codes

import { CrimeCategoryMapping } from './lapd-api-types'

// Legacy crime codes (from 2020-Present dataset)
export const LEGACY_CRIME_MAPPINGS: CrimeCategoryMapping = {
  violent: [
    '110', // CRIMINAL HOMICIDE
    '113', // MANSLAUGHTER, NEGLIGENT
    '121', // RAPE, FORCIBLE
    '122', // RAPE, ATTEMPTED
    '210', // ROBBERY
    '220', // ATTEMPTED ROBBERY
    '230', // ASSAULT WITH DEADLY WEAPON, AGGRAVATED ASSAULT
    '231', // ASSAULT WITH DEADLY WEAPON ON POLICE OFFICER
    '235', // CHILD ABUSE (PHYSICAL) - AGGRAVATED ASSAULT
    '236', // INTIMATE PARTNER - AGGRAVATED ASSAULT
    '250', // SHOTS FIRED AT INHABITED DWELLING
    '251', // SHOTS FIRED AT MOVING VEHICLE, TRAIN OR AIRCRAFT
    '761', // BRANDISH WEAPON
    '762', // LEWD CONDUCT
    '763', // CHILD ANNOYING (17YRS & UNDER)
    '812', // CRM AGNST CHLD (13 OR UNDER) (14-15 & SUSP 10 YRS OLDER)
    '813', // CHILD STEALING
    '815', // SEXUAL PENETRATION W/FOREIGN OBJECT
    '820', // ORAL COPULATION
    '821', // SODOMY/SEXUAL CONTACT B/W PENIS OF ONE PERS TO ANUS OTH
    '822', // HUMAN TRAFFICKING - COMMERCIAL SEX ACTS
    '830', // CHILD ABUSE (PHYSICAL) - SIMPLE ASSAULT
    '845', // SEX OFFENDER REGISTRANT OUT OF COMPLIANCE
    '860', // BATTERY - SIMPLE ASSAULT
    '865', // BATTERY WITH SEXUAL CONTACT
    '866', // LETTERS, LEWD - TELEPHONE CALLS, LEWD
    '870', // KIDNAPPING
    '880', // AGGRAVATED ASSAULT
  ],

  car_theft: [
    '510', // VEHICLE - STOLEN
    '520', // VEHICLE - ATTEMPT STOLEN
  ],

  break_in: [
    '310', // BURGLARY
    '320', // BURGLARY FROM VEHICLE
    '330', // BURGLARY FROM VEHICLE, ATTEMPTED
    '410', // BURGLARY FROM VEHICLE
    '420', // THEFT FROM MOTOR VEHICLE - GRAND ($950.01 AND OVER)
    '421', // THEFT FROM MOTOR VEHICLE - PETTY ($950 & UNDER)
  ],

  petty_theft: [
    '331', // THEFT PLAIN - PETTY ($950 & UNDER)
    '341', // THEFT-GRAND ($950.01 & OVER)EXCPT,GUNS,FOWL,LIVESTK,PROD
    '343', // SHOPLIFTING-GRAND THEFT ($950.01 & OVER)
    '345', // DISHONEST EMPLOYEE - GRAND THEFT
    '347', // GRAND THEFT / INSURANCE FRAUD
    '349', // GRAND THEFT / AUTO REPAIR
    '350', // THEFT, PERSON
    '351', // PURSE SNATCHING
    '352', // PICKPOCKET
    '353', // DRUNK ROLL
    '354', // THEFT OF IDENTITY
    '440', // THEFT PLAIN - PETTY ($950 & UNDER)
    '441', // THEFT PLAIN - ATTEMPT
    '442', // SHOPLIFTING - PETTY THEFT ($950 & UNDER)
    '443', // SHOPLIFTING - ATTEMPT
    '444', // DISHONEST EMPLOYEE - PETTY THEFT
    '445', // DISHONEST EMPLOYEE ATTEMPTED THEFT
    '450', // THEFT FROM MOTOR VEHICLE - PETTY ($950 & UNDER)
    '451', // THEFT FROM MOTOR VEHICLE - ATTEMPT
    '470', // TILL TAP - PETTY ($950 & UNDER)
    '471', // TILL TAP - ATTEMPT
    '473', // THEFT, COIN MACHINE - PETTY ($950 & UNDER)
    '474', // THEFT, COIN MACHINE - ATTEMPT
    '475', // THEFT FROM PERSON - ATTEMPT
    '480', // BIKE - STOLEN
    '485', // BIKE - ATTEMPTED STOLEN
    '487', // BOAT - STOLEN
    '740', // VANDALISM - FELONY ($400 & OVER, ALL CHURCH VANDALISMS)
    '745', // VANDALISM - MISDEMEANOR ($399 OR UNDER)
  ],
}

// NIBRS offense descriptions mapping
// NIBRS uses more standardized offense categories
export const NIBRS_CRIME_MAPPINGS = {
  violent: [
    // Crimes Against Persons
    'Murder and Nonnegligent Manslaughter',
    'Negligent Manslaughter',
    'Justifiable Homicide',
    'Rape',
    'Sodomy',
    'Sexual Assault With An Object',
    'Fondling',
    'Aggravated Assault',
    'Simple Assault',
    'Intimidation',
    'Kidnapping/Abduction',
    'Robbery',
    'Human Trafficking, Commercial Sex Acts',
    'Human Trafficking, Involuntary Servitude',
    'Assault Offenses',
    'Sex Offenses',
  ],

  car_theft: [
    'Motor Vehicle Theft',
    'Theft of Motor Vehicle Parts or Accessories',
  ],

  break_in: [
    'Burglary/Breaking & Entering',
    'Trespass of Real Property',
  ],

  petty_theft: [
    'Larceny/Theft Offenses',
    'Pocket-picking',
    'Purse-snatching',
    'Shoplifting',
    'Theft from Building',
    'Theft from Coin-Operated Machine or Device',
    'Theft from Motor Vehicle',
    'Theft of Motor Vehicle Parts or Accessories',
    'All Other Larceny',
    'Theft From Motor Vehicle',
    'Pickpocket',
    'Fraud Offenses',
    'Identity Theft',
    'Impersonation',
    'False Pretenses/Swindle/Confidence Game',
    'Credit Card/Automated Teller Machine Fraud',
    'Embezzlement',
    'Stolen Property Offenses',
    'Counterfeiting/Forgery',
    'Vandalism',
    'Destruction/Damage/Vandalism of Property',
  ],
}

// Helper function to categorize legacy crime
export function categorizeLegacyCrime(crimeCode: string, description?: string): string | null {
  // Remove any non-numeric characters and pad to 3 digits
  const normalizedCode = crimeCode.replace(/[^0-9]/g, '').padStart(3, '0')

  if (LEGACY_CRIME_MAPPINGS.violent.includes(normalizedCode)) {
    return 'violent'
  }
  if (LEGACY_CRIME_MAPPINGS.car_theft.includes(normalizedCode)) {
    return 'car_theft'
  }
  if (LEGACY_CRIME_MAPPINGS.break_in.includes(normalizedCode)) {
    return 'break_in'
  }
  if (LEGACY_CRIME_MAPPINGS.petty_theft.includes(normalizedCode)) {
    return 'petty_theft'
  }

  // Fallback to description matching if code doesn't match
  if (description) {
    const lowerDesc = description.toLowerCase()
    if (
      lowerDesc.includes('assault') ||
      lowerDesc.includes('robbery') ||
      lowerDesc.includes('rape') ||
      lowerDesc.includes('homicide') ||
      lowerDesc.includes('murder') ||
      lowerDesc.includes('kidnap')
    ) {
      return 'violent'
    }
    if (lowerDesc.includes('vehicle') && lowerDesc.includes('stolen')) {
      return 'car_theft'
    }
    if (lowerDesc.includes('burglary') || lowerDesc.includes('breaking')) {
      return 'break_in'
    }
    if (lowerDesc.includes('theft') || lowerDesc.includes('shoplifting') || lowerDesc.includes('larceny')) {
      return 'petty_theft'
    }
  }

  return null
}

// Helper function to categorize NIBRS crime
export function categorizeNIBRSCrime(offenseDescription: string): string | null {
  const lowerDesc = offenseDescription.toLowerCase()

  // Check violent crimes
  for (const violent of NIBRS_CRIME_MAPPINGS.violent) {
    if (lowerDesc.includes(violent.toLowerCase())) {
      return 'violent'
    }
  }

  // Check car theft
  for (const carTheft of NIBRS_CRIME_MAPPINGS.car_theft) {
    if (lowerDesc.includes(carTheft.toLowerCase())) {
      return 'car_theft'
    }
  }

  // Check break-ins
  for (const breakIn of NIBRS_CRIME_MAPPINGS.break_in) {
    if (lowerDesc.includes(breakIn.toLowerCase())) {
      return 'break_in'
    }
  }

  // Check petty theft (check last since it's most general)
  for (const pettyTheft of NIBRS_CRIME_MAPPINGS.petty_theft) {
    if (lowerDesc.includes(pettyTheft.toLowerCase())) {
      return 'petty_theft'
    }
  }

  return null
}
