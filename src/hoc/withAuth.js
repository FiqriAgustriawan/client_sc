import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || !allowedRoles.includes(user.role))) {
        router.push("/login"); // Redirect ke login jika role tidak sesuai
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <p>Loading...</p>; // Bisa diganti dengan spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
