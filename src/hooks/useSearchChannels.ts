import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { firestore as db } from "@/libs/firebase";

type Channel = {
  id: string;
  title: string;
};

export const useSearchChannels = (searchTerm: string): Channel[] => {
  const [results, setResults] = useState<Channel[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "channels"),
      where("title", ">=", searchTerm),
      where("title", "<=", searchTerm + "\uf8ff"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: Channel[] = [];
      querySnapshot.forEach((doc) => {
        const channel = {
          id: doc.id,
          title: doc.data().title,
        };
        data.push(channel);
      });
      setResults(data);
    });

    return () => {
      unsubscribe();
    };
  }, [searchTerm]);

  return results;
};
