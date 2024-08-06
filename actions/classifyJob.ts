import { genJobObject } from "@/lib/classification";
import { gemini } from "@/lib/models";
import { simpleJobSchema } from "@/lib/schema";

async function classifyJob(jobText: any) {
  console.log("Running Ai - Job");
  try {
    const newJob = await genJobObject(jobText, gemini, simpleJobSchema);

    // console.log({ newJob });
    return newJob;
  } catch (error) {
    console.error(error);
  }
}
export default classifyJob;
