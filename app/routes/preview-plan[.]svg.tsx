import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageTitle = url.searchParams.get("pageTitle") || "Your title here";
  const firstDayOfWeek = url.searchParams.get("firstDayOfWeek");
  const bgImage =
    url.searchParams.get("bgImage") || "https://picsum.photos/id/16/3000/2000";
  const days =
    firstDayOfWeek !== "monday"
      ? [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ]
      : [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
  const svg = svgTemplate
    .replace("{{pageTitle}}", pageTitle)
    .replace("{{day1}}", days[0])
    .replace("{{day2}}", days[1])
    .replace("{{day3}}", days[2])
    .replace("{{day4}}", days[3])
    .replace("{{day5}}", days[4])
    .replace("{{day6}}", days[5])
    .replace("{{day7}}", days[6])
    .replace("{{bgImage}}", bgImage.replace(/&/g, "&amp;"));
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}

const svgTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300mm" height="200mm" version="1.1" viewBox="0 0 300 200" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="clipPath103">
      <rect x="314.84" y="-205.93" width="300" height="200" style="fill:#bf86f3" />
    </clipPath>
  </defs>
  <image transform="translate(-314.84 205.93)" x="307.6" y="-211.09" width="317.3" height="211.09" clip-path="url(#clipPath103)" preserveAspectRatio="none" xlink:href="{{bgImage}}" />
  <g transform="translate(-316.18 200.63)">
    <rect x="320.44" y="-157.72" width="39.329" height="149.33" ry="4.3387" style="fill-opacity:.84574;fill:#ffffff" />
    <rect x="572.59" y="-157.72" width="39.329" height="149.33" ry="4.3387" style="fill-opacity:.84574;fill:#ffffff" />
    <rect x="530.56" y="-157.72" width="39.329" height="149.33" ry="4.3387" style="fill-opacity:.84574;fill:#ffffff" />
    <rect x="488.54" y="-157.72" width="39.329" height="149.33" ry="4.3387" style="fill-opacity:.84574;fill:#ffffff" />
    <rect x="446.51" y="-157.72" width="39.329" height="149.33" ry="4.3387" style="fill-opacity:.84574;fill:#ffffff" />
    <rect x="404.49" y="-157.72" width="39.329" height="149.33" ry="4.3387" style="fill-opacity:.84574;fill:#ffffff" />
    <rect x="362.46" y="-157.72" width="39.329" height="149.33" ry="4.3387" style="fill-opacity:.84574;fill:#ffffff" />
  </g>
  <rect x="-264.94" y="226.15" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-223.74" y="226.15" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-182.53" y="226.15" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-141.33" y="226.15" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-100.13" y="226.15" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-58.923" y="226.15" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-306.14" y="226.15" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-263.71" y="266.84" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-222.5" y="266.84" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-181.3" y="266.84" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-140.1" y="266.84" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-98.894" y="266.84" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-57.691" y="266.84" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-304.91" y="266.84" width="0" height="0" rx="1" style="fill:#ffffff;stroke-dasharray:0.308271, 0.308271;stroke-width:.30827;stroke:#000000" />
  <rect x="-341.19" y="207.61" width="0" height="0" rx="1" style="fill:#1a1a1a;stroke-dasharray:0.349999, 0.349999;stroke-width:.35;stroke:#000000" />
  <text x="149.44812" y="30.656967" style="fill:#ffffff;font-size:25.4px;stroke-width:.8" xml:space="preserve">
    <tspan x="149.44812" y="30.656967" style="fill:#ffffff;font-family:Futura;font-size:25.4px;font-weight:500;stroke-width:.8;text-align:center;text-anchor:middle">{{pageTitle}}</tspan>
  </text>
  <text x="25.016388" y="60.132065" style="fill:#ffffff;font-size:6.35px;stroke-width:.136;stroke:#000000;text-align:center;text-anchor:middle" xml:space="preserve">
    <tspan x="25.016388" y="60.132065" style="fill:#000400;font-family:'PT Serif';font-size:6.35px;stroke-width:.136;stroke:none;text-align:center;text-anchor:middle">{{day1}}</tspan>
  </text>
  <text x="67.144196" y="60.132065" style="fill:#ffffff;font-size:6.35px;stroke-width:.136;stroke:#000000;text-align:center;text-anchor:middle" xml:space="preserve">
    <tspan x="67.144196" y="60.132065" style="fill:#000400;font-family:'PT Serif';font-size:6.35px;stroke-width:.136;stroke:none;text-align:center;text-anchor:middle">{{day2}}</tspan>
  </text>
  <text x="109.20496" y="60.132065" style="fill:#ffffff;font-size:6.35px;stroke-width:.136;stroke:#000000;text-align:center;text-anchor:middle" xml:space="preserve">
    <tspan x="109.20496" y="60.132065" style="fill:#000400;font-family:'PT Serif';font-size:6.35px;stroke-width:.136;stroke:none;text-align:center;text-anchor:middle">{{day3}}</tspan>
  </text>
  <text x="151.29745" y="60.132065" style="fill:#ffffff;font-size:6.35px;stroke-width:.136;stroke:#000000;text-align:center;text-anchor:middle" xml:space="preserve">
    <tspan x="151.29745" y="60.132065" style="fill:#000400;font-family:'PT Serif';font-size:6.35px;stroke-width:.136;stroke:none;text-align:center;text-anchor:middle">{{day4}}</tspan>
  </text>
  <text x="193.25592" y="60.132065" style="fill:#ffffff;font-size:6.35px;stroke-width:.136;stroke:#000000;text-align:center;text-anchor:middle" xml:space="preserve">
    <tspan x="193.25592" y="60.132065" style="fill:#000400;font-family:'PT Serif';font-size:6.35px;stroke-width:.136;stroke:none;text-align:center;text-anchor:middle">{{day5}}</tspan>
  </text>
  <text x="235.24612" y="59.405594" style="fill:#ffffff;font-size:6.35px;stroke-width:.136;stroke:#000000;text-align:center;text-anchor:middle" xml:space="preserve">
    <tspan x="235.24612" y="59.405594" style="fill:#000400;font-family:'PT Serif';font-size:6.35px;stroke-width:.136;stroke:none;text-align:center;text-anchor:middle">{{day6}}</tspan>
  </text>
  <text x="277.90768" y="59.405594" style="fill:#ffffff;font-size:7.0556px;stroke-width:.136;stroke:#000000;text-align:center;text-anchor:middle" xml:space="preserve">
    <tspan x="277.90768" y="59.405594" style="fill:#000400;font-family:'PT Serif';font-size:7.0556px;stroke-width:.136;stroke:none;text-align:center;text-anchor:middle">{{day7}}</tspan>
  </text>
  <text x="114.35669" y="166.50917" style="fill-opacity:.84574;fill:#ffffff;font-family:Futura;font-size:6.35px;font-weight:500;stroke-dasharray:0.370999, 1.113;stroke-width:.371;text-align:center;text-anchor:middle" xml:space="preserve">
    <tspan x="114.35669" y="166.50917" style="stroke-width:.371">t</tspan>
  </text>
</svg>`;
