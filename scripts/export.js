const fs = require("fs");
const http = require("http");
const path = require("path");
const puppeteer = require("puppeteer");

/**
 * Fetch response from server
 * @returns {Promise<number>} - status code
 */
function fetchResponse() {
  return new Promise((res, rej) => {
    try {
      const req = http.request(`http://localhost:3000/#/`, (response) =>
        res(response.statusCode)
      );
      req.on("error", (err) => rej(err));
      req.end();
    } catch (err) {
      rej(err);
    }
  });
}

/**
 * Wait for server to be reachable
 * @returns {Promise<boolean>} - true if server is reachable
 * @throws {Error} - if server is not reachable
 */
async function waitForServerReachable() {
  let counter = 0;
  return new Promise(async (res, rej) => {
    const interval = setInterval(async () => {
      if (counter >= 10) {
        clearInterval(interval);
        rej(new Error("Server is not reachable"));
      }
      try {
        const statusCode = await fetchResponse();
        if (statusCode === 200) {
          clearInterval(interval);
          res(true);
        }
      } catch {}
      counter++;
    }, 1000);
  });
}

/**
 * Get resumes directories
 * @returns {string[]}
 */
function getResumes() {
  const srcpath = path.join(__dirname, "../app/resume/[lang]/");
  return fs.readdirSync(srcpath);
}

/**
 * Get languages from data directory
 * @returns {string[]}
 */
function getLangsFromData() {
  const langs = fs
    .readdirSync(path.join(__dirname, "../public/data/"))
    .map((file) => {
      const dataYamlMatchResult = file.match(/data\-(.+)\.yml/);
      return dataYamlMatchResult ? dataYamlMatchResult[1] : null;
    })
    .filter((item) => item != null);
  if (langs.length === 0) {
    return ["en"];
  }
  return langs;
}

/**
 * Saves pdf of resume
 * @param {Puppeteer.Browser} browser
 * @param {string} resumeName
 * @param {string} lang
 * @param {string} fullDirectoryPath
 * @returns {Promise<void>}
 */
async function savePdf(browser, resumeName, lang, fullDirectoryPath) {
  console.log(`Exporting ${resumeName} in lang ${lang}...`);
  const page = await browser.newPage();
  await page.goto(`http://localhost:3000/resume/${lang}/${resumeName}`, {
    waitUntil: "networkidle2",
  });

  await page.pdf({
    path: `${fullDirectoryPath}${resumeName}-${lang}.pdf`,
    format: "A4",
  });
}

/**
 * Convert resume to pdf
 * @returns {Promise<void>}
 */
async function convert() {
  await waitForServerReachable();

  console.log("Connected to server ...");
  try {
    const fullDirectoryPath = path.join(__dirname, "../pdf/");
    if (!fs.existsSync(fullDirectoryPath)) {
      fs.mkdirSync(fullDirectoryPath);
    }
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    for (const lang of getLangsFromData()) {
        for (const resumeName of getResumes()) {
            await savePdf(browser, resumeName, lang, fullDirectoryPath);
        }
    }
    await browser.close();
  } catch (err) {
    throw new Error(err);
  }
  console.log("Finished exports.");
}

convert();
