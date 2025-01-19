"use server";

import Dashboard from "@/components/Dashboard";
import { createClient } from "../lib/supabase/server";

export default async function DashboardPage() {

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.log("No active session.");
  } else {
    console.log("User ID:", session.user.id);
    console.log("Access Token:", session.provider_token);
    console.log("Token Type:", session.token_type);
    console.log("Expires in:", session.expires_in);
    
      let accessToken = session.provider_token;
    
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    
      const data = await response.json();
      console.log(data);
    }

    return (
        <div>
          <Dashboard token={session?.provider_token}/>
        </div>
    );
}