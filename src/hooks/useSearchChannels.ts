import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { firestore as db } from "@/libs/firebase";

type Product = {
  id: string;
  title: string;
};

export const useSearchChannels = (searchTerm: string): Product[] => {
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "channels"),
      where("title", ">=", searchTerm),
      where("title", "<=", searchTerm + "\uf8ff"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: Product[] = [];
      querySnapshot.forEach((doc) => {
        const product = {
          id: doc.id,
          title: doc.data().title,
        };
        data.push(product);
      });
      setResults(data);
    });

    return () => {
      unsubscribe();
    };
  }, [searchTerm]);

  return results;
};
