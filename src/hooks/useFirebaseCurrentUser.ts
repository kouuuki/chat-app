import { useEffect, useState } from "react";
import { auth } from "@/libs/firebase";
import { User } from "firebase/auth";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return { currentUser, isLoading };
};

export default useCurrentUser;
