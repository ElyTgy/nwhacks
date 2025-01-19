import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { title, description } = await request.json();

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

//   const { data, error } = await supabase
//     .from('Session')
//     .insert([{ title, description }]);


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}