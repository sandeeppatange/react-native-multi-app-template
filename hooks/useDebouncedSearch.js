import { useState, useEffect } from "react";

export const useDebouncedSearch = (
  searchQuery,
  fetchFunction,
  minLength = 2,
  delay = 500
) => {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery && searchQuery.length >= minLength) {
        setDebouncedQuery(searchQuery); // ✅ Update debounced value
      }
    }, delay);

    return () => clearTimeout(handler); // ✅ Clear timeout if input changes
  }, [searchQuery, minLength, delay]);

  useEffect(() => {
    if (debouncedQuery) {
      console.log("Fetching data for debouncedQuery:", debouncedQuery);
      fetchFunction(debouncedQuery); // ✅ Call API only after debounce
    }
  }, [debouncedQuery]);

  return setDebouncedQuery; // ✅ Return function to update query if needed
};
