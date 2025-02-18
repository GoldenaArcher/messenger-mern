// after Formidable v3+, it parses all the fields to be array format by default
export const extractFields = (fields) => {
  return Object.keys(fields).reduce((accum, key) => {
    if (Array.isArray(fields[key]) && fields[key].length === 1) {
      accum[key] = fields[key][0];
    }
    return accum;
  }, {});
};
