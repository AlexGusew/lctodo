import { NextResponse, type NextRequest } from "next/server";
import fetch from "node-fetch";

interface DailyDto {
  data?: {
    activeDailyCodingChallengeQuestion?: {
      question?: {
        frontendQuestionId?: string;
      };
    };
  };
}

const setQID = async (QID: string) => {
  const updateEdgeConfig = await fetch(
    `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            operation: "update",
            key: "dailyQID",
            value: QID,
          },
        ],
      }),
    }
  );
  const result = await updateEdgeConfig.json();
  console.log(result);
};

const getLeetCodeDailyQID = async () => {
  const query = `
query questionOfToday {
  activeDailyCodingChallengeQuestion {
    date
    userStatus
    link
    question {
      titleSlug
      title
      translatedTitle
      acRate
      difficulty
      freqBar
      frontendQuestionId: questionFrontendId
      isFavor
      paidOnly: isPaidOnly
      status
      hasVideoSolution
      hasSolution
      topicTags {
        name
        id
        slug
      }
    }
  }
}
`;

  const rawData = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  const data = (await rawData.json()) as DailyDto;
  const id =
    data?.data?.activeDailyCodingChallengeQuestion?.question
      ?.frontendQuestionId;
  console.log({ QID: id });
  return id;
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const QID = await getLeetCodeDailyQID();
  if (!QID) {
    return NextResponse.json({ ok: false });
  }
  await setQID(QID);
  return NextResponse.json({ ok: true, QID });
}
