import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

const useURLSearchParams = (options = {}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const replace = options.replace ?? true;

  const getAllParams = useCallback(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const getParam = useCallback(
    (key, parser) => {
      const val = searchParams.get(key);
      if (val === null) return null;
      if (parser) return parser(val);
      return val;
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);

      const currentValue = newParams.get(key);

      if (currentValue === String(value)) return;

      newParams.set(key, value);

      navigate(
        { search: newParams.toString() },
        { replace }
      );
    },
    [navigate, searchParams, replace]
  );

  const setParams = useCallback(
    (params) => {
      const newParams = new URLSearchParams(searchParams);
      let changed = false;

      Object.entries(params).forEach(([key, value]) => {
        const current = newParams.get(key);

        if (value === undefined || value === null) {
          if (newParams.has(key)) {
            newParams.delete(key);
            changed = true;
          }
        } else if (current !== String(value)) {
          newParams.set(key, value);
          changed = true;
        }
      });

      if (!changed) return; // 🔥 stop navigation spam

      navigate(
        { search: newParams.toString() },
        { replace }
      );
    },
    [navigate, searchParams, replace]
  );

  const deleteParam = useCallback(
    (key) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(key);
      navigate({ search: newParams.toString() }, { replace });
    },
    [navigate, searchParams, replace]
  );

  // Clear all params
  const clearParams = useCallback(() => {
    navigate({ search: "" }, { replace });
  }, [navigate, replace]);

  return {
    getAllParams,
    getParam,
    setParam,
    setParams,
    deleteParam,
    clearParams,
  };
};

export default useURLSearchParams;
