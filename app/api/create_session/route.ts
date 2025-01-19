import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { startTimestamp, endTimestamp, eegData, provider_token } = data;

        if (!startTimestamp || !endTimestamp || !eegData || !provider_token) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            );
        }

        // Make request to Flask server
        const flaskResponse = await fetch(`${process.env.NEXT_FLASK_URL!}/post_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!flaskResponse.ok) {
            throw new Error(`Flask server responded with status: ${flaskResponse.status}`);
        }

        const responseData = await flaskResponse.json();
        return NextResponse.json(responseData, { status: 200 });

    } catch (error: any) {
        console.error('Error in create_session route:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' }, 
            { status: 500 }
        );
    }
}