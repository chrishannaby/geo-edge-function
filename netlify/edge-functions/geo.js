export default async (request, context) => {
  const url = request?.url;

  // ignore asset calls
  if (/\/(static|_next|fonts)/gi.test(url)) {
    return;
  }

  // reduce api calls if cookie is set
  if (context.cookies.get("mqCountryToggle")) {
    return;
  }

  const forwardedFor = request.headers.get("X-Forwarded-For");
  const splitIps = forwardedFor?.split(",");
  const realIp = splitIps?.[0];

  if (!realIp) {
    return;
  }

  const KEY = "NIKCwrVKhdKic8e";
  const response = await fetch(
    `https://pro.ip-api.com/json/${realIp}?key=${KEY}`
  );
  const ipData = await response.json();

  const countryCode = ipData?.countryCode;
  context.cookies.set({
    name: "mqCountryToggle",
    value: countryCode ? countryCode : "US",
  });
};
