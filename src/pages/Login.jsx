import { SupabaseAuthUI } from "../integrations/supabase/auth.jsx";

export default function Login() {
  return (
    <div className="flex min-h-screen">
      <div className="flex items-center justify-center w-1/2 h-screen">
        <div className="mx-auto grid w-[350px] gap-4 h-full flex items-center justify-center">
          
          <SupabaseAuthUI />
        </div>
      </div>
      <div className="hidden lg:flex w-1/2">
        <img
          src="/images/stockholm-city.jpg"
          alt="Stockholm City"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}