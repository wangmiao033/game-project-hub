import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "game_project_hub_session";

export function isAuthEnabled() {
  return Boolean(
    process.env.APP_LOGIN_USERNAME &&
      process.env.APP_LOGIN_PASSWORD &&
      process.env.APP_SESSION_TOKEN
  );
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? "";
}

export async function isLoggedIn() {
  if (!isAuthEnabled()) {
    return true;
  }

  const token = await getSessionToken();
  return Boolean(token && token === process.env.APP_SESSION_TOKEN);
}
