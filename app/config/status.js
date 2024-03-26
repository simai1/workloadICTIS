const status = {
    accepted: 1,
    reject: 2,
    pending: 3,
};

export default status;
export const map = Object.keys(status).reduce(
    (acc, k) => ({
        ...acc,
        [status[k]]: k,
    }),
    {}
);
