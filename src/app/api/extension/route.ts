import { NextResponse, type NextRequest } from "next/server";

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const userApiToken = request.headers.get("X-USER-API-TOKEN");
    if (!userApiToken) {
        return new NextResponse("Missing X-USER-API-TOKEN header", { status: 400 });
    }

    const body = await request.text();
    if (!body) {
        return new NextResponse("Missing request body", { status: 400 });
    }

    const activeTab: ActiveTab = JSON.parse(body);
    console.log(activeTab.activeTabUrl);
    
    // Log the received token and body
    console.log(`Received token: ${userApiToken}`);
    console.log(`Received body: ${body}`);

    return NextResponse.json(
        { message: "Request processed successfully" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
    );
}


interface ActiveTab
{
    activeTabUrl: string;
}