"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TableJobs from "./table-jobs";
import TableProyects from "./table-proyects";
import * as pdfjsLib from "pdfjs-dist";
import classifyCV from "@/actions/classifyCv";
import classifyJob from "@/actions/classifyJob";
import getFeeback from "@/actions/getFeedback";
import MarkdownRenderer from "@/components/markdown-renderer";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
interface CustomParams {
  message: string;
}

const errorParams: CustomParams = {
  message: "Please upload a PDF file",
};
const formSchema = z.object({
  history: z.array(z.object({ job: z.string(), workplace: z.string() })),
  aboutMe: z.array(z.object({ name: z.string(), description: z.string() })),
  historyJob: z.string(),
  historyWorkplace: z.string(),
  proyectName: z.string(),
  proyectDescription: z.string(),
  job: z.string().min(100, "Job description is too short"),
  pdfFile: z.instanceof(FileList, errorParams),
});

type FormSchema = z.infer<typeof formSchema>;

const FeedbackForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      history: [],
      aboutMe: [],
      historyJob: "",
      historyWorkplace: "",
      proyectName: "",
      proyectDescription: "",
      job: "",
      pdfFile: undefined,
    },
  });

  const isDirty = form.formState.isDirty;

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);

    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    const textContent: string[] = [];

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const text = await page.getTextContent();
      textContent.push(text.items.map((item: any) => item.str).join(" "));
    }

    return textContent.join("\n");
  };

  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    setIsLoading(true);
    console.log(values);

    const file = values.pdfFile?.[0];
    if (file) {
      const text = await extractTextFromPDF(file);
      // console.log("Extracted Text: ", text);
      const cvObj = (await classifyCV(text)) as any;
      const jobObj = (await classifyJob(values.job)) as any;
      const feedbackText = await getFeeback(cvObj, jobObj);

      setFeedbackText(feedbackText);
    }

    setIsLoading(false);
    router.refresh();
  };

  // const addJob = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   if (
  //     form.getValues().historyJob.length === 0 ||
  //     form.getValues().historyWorkplace.length === 0
  //   ) {
  //     return;
  //   }
  //   form.setValue("history", [
  //     ...form.getValues().history,
  //     {
  //       job: form.getValues().historyJob,
  //       workplace: form.getValues().historyWorkplace,
  //     },
  //   ]);
  //   form.setValue("historyJob", "");
  //   form.setValue("historyWorkplace", "");
  //   router.refresh();
  // };

  // const addProyect = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   if (
  //     form.getValues().proyectName.length === 0 ||
  //     form.getValues().proyectDescription.length === 0
  //   ) {
  //     return;
  //   }
  //   form.setValue("aboutMe", [
  //     ...form.getValues().aboutMe,
  //     {
  //       name: form.getValues().proyectName,
  //       description: form.getValues().proyectDescription,
  //     },
  //   ]);
  //   form.setValue("proyectName", "");
  //   form.setValue("proyectDescription", "");
  //   router.refresh();
  // };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row justify-center  b-4 gap-x-4 gap-y-4"
        >
          {/* <div className="border border-gray-400 rounded-sm p-2">
            <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem className="mb-1">
                  <FormLabel>History</FormLabel>
                  <TableJobs jobs={form.getValues().history} />

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-x-2">
              <FormField
                control={form.control}
                name="historyJob"
                render={({ field }) => (
                  <FormItem className="mb-1">
                    <Input disabled={isLoading} placeholder="Job" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historyWorkplace"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      disabled={isLoading}
                      placeholder="Workplace"
                      {...field}
                    />
                    <Button type="button" onClick={(e) => addJob(e)}>
                      Add Job
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem className="mb-1">
                  <FormLabel>About Me</FormLabel>
                  <TableProyects proyects={form.getValues().aboutMe} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-x-2">
              <FormField
                control={form.control}
                name="proyectName"
                render={({ field }) => (
                  <FormItem className="mb-1">
                    <Input
                      disabled={isLoading}
                      placeholder="Proyect"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proyectDescription"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      disabled={isLoading}
                      placeholder="Description"
                      {...field}
                    />
                    <Button type="button" onClick={(e) => addProyect(e)}>
                      Add Proyect
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          
          </div> */}
          <div className="flex flex-col border border-gray-400 rounded-sm p-2 w-full mb-28 ">
            <FormField
              control={form.control}
              name="pdfFile"
              render={({ field }) => (
                <FormItem className="mb-1">
                  <FormLabel>Upload your CV</FormLabel>
                  <Input
                    type="file"
                    disabled={isLoading}
                    onChange={(e) =>
                      field.onChange(e.target.files as unknown as FileList)
                    }
                    accept=".pdf"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <Textarea
                    className="w-full h-28"
                    disabled={isLoading}
                    placeholder="Job Description or Link"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading || !isDirty}
              className="col-span-2 w-full my-2"
              type="submit"
            >
              Submit
            </Button>
            <Tabs defaultValue="feedback" className="flex-grow flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="feedback">
                  Feedback
                </TabsTrigger>
                {/* <TabsTrigger className="w-1/2" value="metadata">
                  Metadata
                </TabsTrigger> */}
              </TabsList>
              <TabsContent className="flex-grow" value="feedback">
                {/* <Textarea
                  className="h-full w-full"
                  value={cvText}
                  onChange={(e) => {}}
                /> */}
                <MarkdownRenderer content={feedbackText} />
              </TabsContent>
              {/* <TabsContent value="metadata">
                <div className="flex flex-row gap-x-1">
                  <Textarea readOnly value="metadata" />
                  <Textarea readOnly value="habilidades necesarias" />
                </div>
              </TabsContent> */}
            </Tabs>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackForm;
function description(arg0: string): any {
  throw new Error("Function not implemented.");
}
