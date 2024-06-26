import { SupabaseAuthUI } from "../integrations/supabase/auth.jsx";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center justify-center py-12 h-full">
        <div className="mx-auto grid w-[350px] gap-4 h-full">
          
          <SupabaseAuthUI />
        </div>
      </div>
      <div className="hidden bg-muted lg:block h-full">
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