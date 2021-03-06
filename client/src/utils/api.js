const createHeaders = (extraHeaders = {}, authToken = null) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...extraHeaders
  };
  if (authToken) headers["Authorization"] = `Token ${authToken}`;
  return headers;
};

export const GET = (url, authToken = null, extraHeaders = {}) =>
  fetch(url, {
    headers: createHeaders(extraHeaders, authToken)
  });

const createResourceModifier = method => (
  url,
  authToken = null,
  data = {},
  extraHeaders = {}
) =>
  fetch(url, {
    headers: createHeaders(extraHeaders, authToken),
    body: JSON.stringify(data),
    method
  });

export const POST = (url, authToken = null, data = {}, extraHeaders = {}) =>
  fetch(url, {
    headers: createHeaders(extraHeaders, authToken),
    body: JSON.stringify(data),
    method: "POST"
  });

export const PATCH = (url, authToken = null, data = {}, extraHeaders = {}) =>
  fetch(url, {
    headers: createHeaders(extraHeaders, authToken),
    body: JSON.stringify(data),
    method: "PATCH"
  });

export const DELETE = createResourceModifier("DELETE");
