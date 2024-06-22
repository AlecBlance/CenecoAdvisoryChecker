import jsdom from "jsdom";
import fs from "fs";

/**
 * Adds the CORS proxy URL to the given URL.
 *
 * @param {string} url - The URL to add the CORS proxy to.
 * @returns {string} The modified URL with the CORS proxy.
 */
const corsUrl = (url) => {
  return "https://corsproxy.io/?" + encodeURIComponent(url);
};

/**
 * Extracts the DOM from the provided URL.
 *
 * @param {string} urlToFetch - The URL to fetch and extract the DOM from.
 * @returns {Document} - The extracted DOM document.
 */
const extractDom = async (urlToFetch) => {
  const url = corsUrl(urlToFetch);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });
  const html = await response.text();
  const dom = new jsdom.JSDOM(html);
  return dom.window.document;
};

/**
 * Creates an advisory by extracting the latest URL from the Ceneco website.
 * @param {Object} cenecoAdvisory - The current Ceneco advisory object.
 * @returns {Promise<string>} - The latest URL of the advisory.
 */
const createAdvisory = async (cenecoAdvisory) => {
  const dom = await extractDom("https://www.ceneco.ph/advisory");
  const article = dom.querySelectorAll("article");
  const latestUrl = article[0].querySelector("a").href;
  if (cenecoAdvisory.latest === latestUrl) return;
  cenecoAdvisory.latest = latestUrl;
  console.log("New advisory found:", latestUrl);
  fs.writeFileSync("./cenecoAdvisory.json", JSON.stringify(cenecoAdvisory));
  return latestUrl;
};

/**
 * Checks if a specific place is present in the content of a given URL.
 * @param {string} place - The place to search for.
 * @param {string} latestUrl - The URL to extract the content from.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the place is present in the content.
 */
export const checkIfPlacePresent = async (place, latestUrl) => {
  const dom = await extractDom(latestUrl);
  const divWithPlace = [
    ...dom.body.querySelectorAll('[data-widget_type="text-editor.default"]'),
  ].filter((el) =>
    el.textContent.toLowerCase().includes(place.toLowerCase())
  )[0];
  if (!divWithPlace) return false;
  const filePath = "./cenecoAdvisory.json";
  const cenecoAdvisory = JSON.parse(fs.readFileSync(filePath, "utf8"));
  cenecoAdvisory.brownOut = true;
  fs.writeFileSync(filePath, JSON.stringify(cenecoAdvisory));
  const dateAndTime = [...divWithPlace.querySelectorAll("p")]
    .filter((el) => {
      const text = el.textContent.toLowerCase();
      return text.includes("date") || text.includes("time");
    })
    .map((el) => el.textContent.trim())
    .join(" ");
  return dateAndTime;
};

/**
 * Checks if there is a new advisory and returns the latest URL.
 * @returns {Promise<string>} The URL of the latest advisory.
 */
export const isNewAdvisory = async () => {
  const filePath = "./cenecoAdvisory.json";
  if (!fs.existsSync(filePath)) {
    const content = JSON.stringify({ latest: "" });
    fs.writeFileSync(filePath, content);
  }
  const cenecoAdvisory = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const latestUrl = await createAdvisory(cenecoAdvisory);
  return latestUrl;
};
