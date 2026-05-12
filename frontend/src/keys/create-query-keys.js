export const createQueryKeys = (resourceName, extra = () => ({})) => {
  const base = {
    all: [resourceName],

    lists: () => [resourceName, "list"],
    list: (params = {}) => [resourceName, "list", params],

    details: () => [resourceName, "detail"],
    detail: (id) => [resourceName, "detail", id],
  };

  return {
    ...base,
    ...extra(base),
  };
};
