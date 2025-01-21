import { NextResponse } from 'next/server';
import supabase from "../../lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
  }
  
  try {
    const { data, error } = await supabase
      .from('Session')
      .select(`
        *,
        Songs(id,image,song_name,spotify_url,artist_name,song_ts,focused)
      `)
      .eq('id', id)
      .eq('Songs.focused', true);
    
    if (error) {
      console.error("Error from the session ID fetch:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (data) {
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "No data found" }, { status: 404 });

  } catch (error) {
    console.error("Error retrieving frames:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving the frames." }, 
      { status: 500 }
    );
  }
}