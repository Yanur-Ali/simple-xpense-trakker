
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, LogIn, Phone, Mail } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpVerificationSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type EmailLoginFormValues = z.infer<typeof emailLoginSchema>;
type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;
type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>;

const Login = () => {
  const { login, isLoading, sendOtp, verifyOtp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [phoneForOtp, setPhoneForOtp] = useState("");

  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const phoneForm = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const otpForm = useForm<OtpVerificationFormValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      phone: "",
      otp: "",
    },
  });

  const onEmailSubmit = async (data: EmailLoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password, false);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPhoneSubmit = async (data: PhoneLoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.phone, data.password, true);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRequestOtp = async () => {
    const phone = phoneForm.getValues("phone");
    if (!phone || phone.length < 10) {
      phoneForm.setError("phone", { message: "Valid phone number required" });
      return;
    }

    setIsSubmitting(true);
    try {
      await sendOtp(phone);
      setPhoneForOtp(phone);
      setShowOtpVerification(true);
      otpForm.setValue("phone", phone);
    } catch (error) {
      console.error("OTP request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyOtp = async (data: OtpVerificationFormValues) => {
    setIsSubmitting(true);
    try {
      await verifyOtp(data.phone, data.otp);
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/50">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg mb-4">
              <LogIn className="text-primary-foreground h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue to your account
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          {showOtpVerification ? (
            <Card>
              <CardHeader>
                <CardTitle>Verify Phone Number</CardTitle>
                <CardDescription>
                  Enter the verification code sent to {phoneForOtp}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...otpForm}>
                  <form
                    onSubmit={otpForm.handleSubmit(onVerifyOtp)}
                    className="space-y-4"
                  >
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                          <FormLabel className="text-center mb-2">Verification Code</FormLabel>
                          <FormControl>
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowOtpVerification(false)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email">
                    <Form {...emailForm}>
                      <form
                        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="your.email@example.com"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={emailForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="••••••••"
                                  type="password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="phone">
                    <Form {...phoneForm}>
                      <form
                        onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={phoneForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+1234567890"
                                  type="tel"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={phoneForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="••••••••"
                                  type="password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={onRequestOtp}
                            disabled={isSubmitting}
                          >
                            Sign In with OTP
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground w-full">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Sign Up
                  </Link>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">
                    Back to Home
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
