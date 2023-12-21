import puppeteer from "puppeteer";
import serveHandler from "serve-handler";
import http from "http";
import path from "path";
import { execSync } from "child_process";

let server;
let page;
let browser;

beforeAll(async () => {
  console.log("Building production...");
  execSync("yarn build", { cwd: path.join(__dirname, "../..") });

  server = http.createServer((request, response) => {
    return serveHandler(request, response, {
      public: path.join(__dirname, "../../build"),
    });
  });
  server.listen(5123, () => {
    console.log("Running at http://localhost:5123");
  });

  browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();
});

// https://stackoverflow.com/a/3627747/304706
const rgb2hex = (rgb) => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

describe("Test production app", () => {
  test("craco-antd sets the correct primary color and increments counter", async () => {
    await page.goto("http://localhost:5123");

    await page.waitForSelector(".ant-layout-header");
    const headerBackgroundColorRGB = await page.evaluate(() => {
      const header = document.querySelector(".ant-layout-header");
      return getComputedStyle(header).backgroundColor;
    });
    const headerBackgroundColorHex = rgb2hex(headerBackgroundColorRGB);
    expect(headerBackgroundColorHex).toEqual("#13bf77");

    await page.waitForSelector(".ant-btn-primary");
    const buttonBackgroundColorRGB = await page.evaluate(() => {
      const button = document.querySelector(".ant-btn-primary");
      return getComputedStyle(button).backgroundColor;
    });
    console.log(buttonBackgroundColorRGB);
    const buttonBackgroundColorHex = rgb2hex(buttonBackgroundColorRGB);
    expect(buttonBackgroundColorHex).toEqual("#8813bf");

    let alertText = await page.$eval(
      ".ant-alert .ant-alert-message",
      (el) => el.textContent,
    );
    expect(alertText).toEqual("Counter: 0");

    await page.click(".ant-btn-primary");

    alertText = await page.$eval(
      ".ant-alert .ant-alert-message",
      (el) => el.textContent,
    );
    expect(alertText).toEqual("Counter: 1");
  }, 16000);
});

afterAll(() => {
  browser.close();
  server.close();
});
