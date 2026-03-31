import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [otpSend, setOtpSend] = useState(false);
  const navigate = useNavigate();

  const handleForgetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email.trim()) {
      toast.error("Email is required");
    }

    try {
      console.log("formData : ", formData);
      const payload = {
        email: formData.email,
      };
      console.log("Payload", payload);

      const response = await axios.post(
        "http://localhost:3000/api/user/forgetPassword",
        payload
      );
      console.log("response", response);

      if (response.data.status) {
        toast.success(response.data.data.message || "successfully OTP sent");
        setOtpSend(true)
      }
    } catch (error) {
      toast.error("Someting went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        otp: formData.otp,
        newPassword: formData.newPassword,
        conformPassword: formData.confirmPassword,
      };
      console.log("payload", payload);

      const response = await axios.post(
        "http://localhost:3000/api/user/resetPassword",
        payload
      );
      console.log("response", response);

      if (response.data.status) {
        toast.success(response.data.data.message || "Password reset successfully");
        navigate("/auth");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold text-foreground">ShopEase</span>
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          {otpSend ? "Reset Password" : "Forgot Password"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {otpSend
            ? "Enter OTP and your new password"
            : "Enter your email to receive OTP"}
        </p>

        {/* ================= FORM ================= */}
        <form
          onSubmit={otpSend ? handleResetPassword : handleForgetPassword}
          className="space-y-5"
        >
          {/* EMAIL (only when otp not sent) */}
          {!otpSend && (
            <div>
              <Label>Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* OTP */}
          {otpSend && (
            <>
              <div>
                <Label>OTP</Label>
                <div className="relative mt-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otp: e.target.value,
                      })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>New Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newPassword: e.target.value,
                      })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : otpSend
              ? "Reset Password"
              : "Send OTP"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </div>
    </main>
  );
};

export default ForgetPassword;
