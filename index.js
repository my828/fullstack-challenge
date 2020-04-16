addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Return specific cookie value 
 * Code credit: https://stackoverflow.com/questions/10730362/get-cookie-by-name
 * @param {String} name cookie name
 * @param {String} cookie full cookie string
 */
function getCookie(name, cookie) {
  var value = "; " + cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2)
    return parts
      .pop()
      .split(";")
      .shift();
}
/**
 * Respond with random variant script
 * @param {Request} request
 */
async function handleRequest(request) {
  let response = new Response("Hello world!");
  let url;
  if (request.method === "GET") {
    let cookieURL = getCookie("url", request.headers.get("Cookie"));
    if (cookieURL) {
      url = cookieURL;
    } else {
      url = await fetchURLs(
        "https://cfw-takehome.developers.workers.dev/api/variants"
      );
    }
    let script = await fetchScript(url);
    response = new Response(script, {
      headers: {
        "content-type": "text/plain",
        "Set-Cookie": [`url=${url}`]
      }
    });
  }
  return response;
}

/**
 * Return a random variant URL
 * @param {String} variantsURL 
 */
async function fetchURLs(variantsURL) {
  let URLs = await fetch(variantsURL)
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then(data => data.variants)
    .catch(err => console.log(err));
  let randomURL = URLs[Math.floor(Math.random() * 2)];
  return randomURL;
}

/**
 * Return web script
 * @param {String} url
 */
async function fetchScript(url) {
  let script = await fetch(url)
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.text();
    })
    .catch(err => console.log(err));
  return script;
}
