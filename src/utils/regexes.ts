// got email regex from https://emailregex.com/
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const emailRegexString = emailRegex.source;

// e.g. "Jim Jones<jim@jones.com>"
const emailWithNameRegexString = `([^<]+)<(${emailRegexString})>`;

// e.g. "jim@jones.com" OR "Jim Jones<jim@jones.com>"
const emailOrEmailWithNameRegex = new RegExp(
  `(${emailRegexString})|${emailWithNameRegexString}`,
);

const emailOrEmailWithNameRegexString = emailOrEmailWithNameRegex.source;

// e.g. "Jim Jones<jim@jones.com>,John Smith<john@smith.com>"
export const emailFieldMultipleRegex = new RegExp(
  `^${emailOrEmailWithNameRegexString}(,${emailOrEmailWithNameRegexString})*$`,
);
export const emailFieldSingleRegex = new RegExp(
  `^${emailOrEmailWithNameRegexString}$`,
);

export const onlyEmailRegex = new RegExp(`^${emailRegexString}$`);
export const onlyEmailWithNameRegex = new RegExp(
  `^${emailWithNameRegexString}$`,
);
