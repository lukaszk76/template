import React, {
  memo,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { AppContext } from "@/AppContext";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "@/lib/useTranslations";
import emailjs from "@emailjs/browser";
import { Icons } from "@/components/ui/icons";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
// @ts-ignore
import { addAnimatedCursor } from "@/components/animatedCursor.js";
import { Loader } from "@/components/Loader/Loader";

export const ContactForm = memo(() => {
  const { isContactFormOpen, setIsContactFormOpen } = useContext(AppContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const { getTranslation } = useTranslations();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const formSchema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(2, { message: getTranslation("error_name") })
          .max(50, { message: getTranslation("error_name") }),
        email: z.string().email({ message: getTranslation("error_email") }),
        phone: z
          .string()
          .min(9, { message: getTranslation("error_phone") })
          .max(15, { message: getTranslation("error_phone") })
          .or(z.string().length(0)),
        message: z
          .string()
          .min(10, { message: getTranslation("error_message") })
          .max(500, { message: getTranslation("error_message") }),
      }),
    [],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  useEffect(() => {
    if (isContactFormOpen) {
      gsap.to(window, {
        duration: 1,
        ease: "power2.inOut",
        scrollTo: "#contact-form",
      });

      addAnimatedCursor();
    }
  }, [isContactFormOpen]);

  const displaySuccessMessage = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  const displayErrorMessage = () => {
    setIsError(true);
    setTimeout(() => {
      setIsError(false);
    }, 5000);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const templateParams = {
      from_name: values.username,
      reply_to: values.email,
      message: values.message,
      phone: values.phone,
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        "template_g7yd97u",
        templateParams,
        import.meta.env.VITE_EMAILJS_API_KEY,
      )
      .then(
        function () {
          displaySuccessMessage();
        },
        function () {
          displayErrorMessage();
        },
      )
      .then(() => {
        clearForm();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function clearForm() {
    form.reset({
      username: "",
      email: "",
      phone: "",
      message: "",
    });
  }

  return (
    <>
      {isSuccess && (
        <Alert className="fixed left-[50%] top-[30%] translate-x-[-50%] w-max min-w-[30vw] bg-green-700">
          <AlertTitle className="flex gap-2 items-center text-xl">
            <Icons.smile className="h-6 w-6" />
            {getTranslation("contact_success_message_title")}
          </AlertTitle>
          <AlertDescription className="mt-4">
            {getTranslation("contact_success_message")}
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert className="fixed left-[50%] top-[30%] translate-x-[-50%] w-max min-w-[30vw] bg-destructive">
          <AlertTitle className="flex gap-2 items-center text-xl">
            <Icons.frown className="h-6 w-6" />
            {getTranslation("contact_error_message_title")}
          </AlertTitle>
          <AlertDescription className="mt-4">
            {getTranslation("contact_error_message")}
          </AlertDescription>
        </Alert>
      )}

      <Collapsible
        open={isContactFormOpen}
        onOpenChange={setIsContactFormOpen}
        className="w-full"
      >
        <div
          className="flex gap-4 p-4 items-center justify-between w-full"
          id="contact-form"
        >
          <h3 className="text-2xl font-bold">
            {getTranslation("contact_welcome")}
          </h3>
          <CollapsibleTrigger>
            <Button size="icon" variant="ghost" style={{ cursor: "none" }}>
              {isContactFormOpen ? <Icons.collapse /> : <Icons.expand />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="CollapsibleContent">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-4 flex flex-col gap-4 w-full CollapsibleContent"
            >
              <div className="flex flex-col md:grid md:grid-cols-3 gap-4 w-full CollapsibleContent">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full CollapsibleContent">
                      <FormLabel>
                        {getTranslation("contact_username")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={getTranslation("contact_username")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {getTranslation("contact_username_description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full CollapsibleContent">
                      <FormLabel>{getTranslation("contact_email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={getTranslation("contact_email")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {getTranslation("contact_email_description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full CollapsibleContent">
                      <FormLabel>{getTranslation("contact_phone")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={getTranslation("contact_phone")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {getTranslation("contact_phone_description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full CollapsibleContent">
                    <FormLabel>{getTranslation("contact_message")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={getTranslation("contact_message")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs CollapsibleContent">
                      {getTranslation("contact_message_description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full md:grid md:grid-cols-3 CollapsibleContent">
                <Button
                  type="submit"
                  variant="secondary"
                  style={{ cursor: "none" }}
                  className="w-full md:col-start-3 CollapsibleContent"
                >
                  {isLoading ? <Loader /> : getTranslation("contact_send")}
                </Button>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>
      <Separator className="mt-4 w-full" />
    </>
  );
});

ContactForm.displayName = "ContactForm";
