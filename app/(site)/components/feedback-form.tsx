"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import TableJobs from "./table-jobs";
import TableProyects from "./table-proyects";
// import toast from "react-hot-toast";

const formSchema = z.object({
  history: z.array(z.object({ job: z.string(), workplace: z.string() })),
  aboutMe: z.array(z.object({ name: z.string(), description: z.string() })),
  historyJob: z.string(),
  historyWorkplace: z.string(),
  proyectName: z.string(),
  proyectDescription: z.string(),
  job: z.string().min(2),
});

const FeedbackForm = () => {
  const router = useRouter();
  //   const initialData = userInfo
  //     ? {
  //         fullName: userInfo.full_name,
  //         carrer: userInfo.carrer,
  //         aboutMe: userInfo.about_me,
  //         facebook: userInfo.facebook,
  //         instagram: userInfo.instagram,
  //         tiktok: userInfo.tiktok,
  //         twitter: userInfo.twitter,
  //       }
  //     : {};

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      history: [],
      aboutMe: [],
      historyJob: "",
      historyWorkplace: "",
      proyectName: "",
      proyectDescription: "",
      job: "",
    },
  });

  const isDirty = form.formState.isDirty;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
  }

  const addJob = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      form.getValues().historyJob.length === 0 ||
      form.getValues().historyWorkplace.length === 0
    ) {
      return;
    }
    form.setValue("history", [
      ...form.getValues().history,
      {
        job: form.getValues().historyJob,
        workplace: form.getValues().historyWorkplace,
      },
    ]);
    form.setValue("historyJob", "");
    form.setValue("historyWorkplace", "");
    router.refresh();
  };
  const addProyect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      form.getValues().proyectName.length === 0 ||
      form.getValues().proyectDescription.length === 0
    ) {
      return;
    }
    form.setValue("aboutMe", [
      ...form.getValues().aboutMe,
      {
        name: form.getValues().proyectName,
        description: form.getValues().proyectDescription,
      },
    ]);
    form.setValue("proyectName", "");
    form.setValue("proyectDescription", "");
    router.refresh();
  };
  return (
    <div>
      {/* <h1 className="text-xl text-center m-4">Feedback CV</h1> */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:grid  md:grid-cols-2 gap-x-4 gap-y-4"
        >
          <div className="border border-gray-400 rounded-sm p-2">
            <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem className="max-h-48 overflow-y-scroll mb-1">
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
                    <Button
                      type="button"
                      onClick={(e) => {
                        addJob(e);
                      }}
                    >
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
                <FormItem className="max-h-48 overflow-y-scroll mb-1">
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
                    <Button
                      type="button"
                      onClick={(e) => {
                        addProyect(e);
                      }}
                    >
                      Add Proyect
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="border border-gray-400 rounded-sm p-2 w-full ">
            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <Input
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
            <Tabs defaultValue="feedback" className="">
              <TabsList className="w-full">
                <TabsTrigger className="w-1/2" value="feedback">
                  Feedback
                </TabsTrigger>
                <TabsTrigger className="w-1/2" value="metadata">
                  Metadata
                </TabsTrigger>
              </TabsList>
              <TabsContent value="feedback">
                <Textarea readOnly value="feedback" />
              </TabsContent>
              <TabsContent value="metadata">
                <div className="flex flex-row gap-x-1">
                  <Textarea readOnly value="metadata" />
                  <Textarea readOnly value="habilidades necesarias" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackForm;
