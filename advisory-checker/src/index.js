import core from "@actions/core";
import exec from "@actions/exec";
import { isNewAdvisory, checkIfPlacePresent } from "./utils/index.utils.js";

const place = core.getInput("place");
const advisory = await isNewAdvisory();
if (!advisory) {
  core.setOutput("isSendEmail", false);
  console.log("No new advisory found");
  process.exit();
}
const isPresent = await checkIfPlacePresent(place, advisory);
core.setOutput("isSendEmail", !!isPresent);
core.setOutput("advisoryUrl", advisory);
core.setOutput("dateAndTime", isPresent);
await exec.exec("./advisory-checker/src/updateAdvisory.sh");
