const core = require("@actions/core");

const api = core.getInput("api");
const numbers = core.getInput("numbers");
const place = core.getInput("place");
const time = core.getInput("time");
const numbersArr = numbers.split(",");
for (const number of numbersArr) {
  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      number: `${number}`,
      message: `Brownout advisory for ${place} on ${time} is now available.`,
    }),
  });
}
