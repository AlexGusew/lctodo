// hooks/useStaticFile.ts
import { useEffect, useState } from "react";

interface UseStaticFileResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useStaticFile = <T>(filePath: string): UseStaticFileResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filePath]);

  return { data, loading, error };
};

export default useStaticFile;
