import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SupabaseAuthUI, useSupabaseAuth } from "../integrations/supabase/auth.jsx";

export default function Login() {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="flex min-h-screen">
      <div className="flex items-center justify-center w-1/2 h-screen">
        <div className="mx-auto grid w-[350px] gap-4 h-full flex items-center justify-center">
          <SupabaseAuthUI />
        </div>
      </div>
      <div className="hidden lg:flex w-1/2">
        <img
          src="https://gzebeizzqadyipfhvkuo.supabase.in/storage/v1/object/public/bucket/images/stockholm-city.jpg"
          alt="Stockholm City"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}