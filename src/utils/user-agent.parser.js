import { UAParser } from "ua-parser-js";

export function parseUserAgent(uaString) {
  const parser = new UAParser(uaString)
  const result = parser.getResult();

  return {
    os: result.os.name ?? null,
    browser: result.browser.name ?? null,
    device: result.device.type ?? 'desktop',
  };
}
