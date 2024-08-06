import { genCVObject } from "@/lib/classification";
import { gemini, llama } from "@/lib/models";
import { simpleCVSchena } from "@/lib/schema";

async function classifyCV(cvtext: any) {
  console.log("Running Ai - CV");
  try {
    const newCV = await genCVObject(cvtext, llama, simpleCVSchena);
    // console.log(newCV);
    return newCV;
  } catch (error) {
    console.error(error);
  }
}

export default classifyCV;
