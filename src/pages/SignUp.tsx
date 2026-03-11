import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-heading text-lg font-semibold text-foreground">StyleAI</span>
        </Link>
        <p className="text-sm font-body text-foreground/50">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-accent font-semibold hover:underline">Đăng nhập</Link>
        </p>
      </div>

      {/* Center — form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-1.5 text-center">
            Tạo tài khoản
          </h1>
          <p className="text-foreground/50 font-body text-sm mb-7 text-center">
            Bắt đầu hành trình thời trang AI của bạn.
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <Label className="font-body text-[11px] font-semibold uppercase tracking-wider text-foreground/55">Tên hiển thị</Label>
              <Input placeholder="Tên của bạn" value={name} onChange={(e) => setName(e.target.value)} className="h-11 font-body border-border bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-[11px] font-semibold uppercase tracking-wider text-foreground/55">Email</Label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 font-body border-border bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-[11px] font-semibold uppercase tracking-wider text-foreground/55">Mật khẩu</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 font-body border-border bg-background pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Link to="/quiz" className="block pt-1">
              <Button variant="accent" size="lg" className="w-full h-11 font-body font-semibold gap-2">
                Tiếp tục <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-body uppercase tracking-wider text-foreground/35">hoặc</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 font-body gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </Button>
            <Button variant="outline" className="flex-1 h-11 font-body gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Apple
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="shrink-0 px-6 py-3 text-center">
        <p className="text-[11px] font-body text-foreground/30 leading-relaxed">
          Sau khi tạo tài khoản, bạn sẽ trả lời vài câu hỏi nhanh để AI hiểu phong cách của bạn.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
