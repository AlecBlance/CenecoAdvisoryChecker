const core = require("@actions/core");

const api = core.getInput("api");
const numbers = core.getInput("numbers");
const place = core.getInput("place");
const time = core.getOutput("time");
const numbersArr = numbers.split(",");
for (const number of numbersArr) {
  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      number: `${number}`,
      message: `Hi, there is a brownout advisory for ${place}.\n\n${time}`,
    }),
  });
}
