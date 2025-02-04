import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/auth";
import { cookies } from "next/headers";

import type { OAuth2Tokens } from "arctic";
import { github } from "@/lib/auth";
import { createGithubUser, getUserFromGitHubId } from "@/db/User";
import type { GithubUser } from "@/app/types";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const githubUser = await githubUserResponse.json();

  const userDto: GithubUser = {
    githubId: githubUser.id,
    githubAvatarUrl: githubUser.avatar_url,
    githubEmail: githubUser.email,
    githubName: githubUser.name,
    githubUsername: githubUser.login,
  };

  const existingUser = await getUserFromGitHubId(userDto.githubId);

  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  if (!userDto.githubEmail) {
    const emailListRequest = new Request("https://api.github.com/user/emails");
    emailListRequest.headers.set(
      "Authorization",
      `Bearer ${tokens.accessToken()}`
    );
    const emailListResponse = await fetch(emailListRequest);
    const emailListResult: unknown = await emailListResponse.json();
    if (!Array.isArray(emailListResult) || emailListResult.length < 1) {
      return new Response("Please restart the process.", {
        status: 400,
      });
    }

    for (const emailRecord of emailListResult) {
      const primaryEmail = emailRecord.primary;
      const verifiedEmail = emailRecord.verified;
      if (primaryEmail && verifiedEmail) {
        userDto.githubEmail = emailRecord.email;
      }
    }
    if (userDto.githubEmail === null) {
      return new Response("Please verify your GitHub email address.", {
        status: 400,
      });
    }
  }

  const user = await createGithubUser(userDto);

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
