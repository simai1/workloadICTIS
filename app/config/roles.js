const roles = {
    DEPARTMENT_HEAD: 1,
    METHODIST: 2,
    DIRECTORATE: 3,
    LECTURER: 4,
};

export default roles;
export const map = Object.keys(roles).reduce(
  (acc, k) => ({
      ...acc,
      [roles[k]]: k,
  }),
  {}
);
