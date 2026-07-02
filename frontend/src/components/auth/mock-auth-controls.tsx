"use client";

import { LogIn, LogOut, UserRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RadioPillGroup } from "@/components/domain/pill-radio-group";
import { ModalCardHeader } from "@/components/domain/modal-card-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { matchlogApi, type UserDetail } from "@/lib/api";

type AuthMode = "login" | "signup";

const demoAccount = {
  email: "easyh@gamelog.local",
  password: "mock1234",
};

export function MockAuthControls() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginForm, setLoginForm] = useState(demoAccount);
  const [signupForm, setSignupForm] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  async function loadSession() {
    const session = await matchlogApi.getSession();
    setUser(session.user);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    void loadSession();
  }, []);

  useEffect(() => {
    if (!open) {
      setError("");
      setMode("login");
    }
  }, [open]);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await matchlogApi.login(loginForm);
      window.location.reload();
    } catch {
      setError("로그인에 실패했습니다. Mock 계정을 확인해주세요.");
    } finally {
      setSaving(false);
    }
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await matchlogApi.signup(signupForm);
      window.location.reload();
    } catch {
      setError("회원가입에 실패했습니다. 이미 사용 중인 이메일인지 확인해주세요.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await matchlogApi.logout();
    window.location.reload();
  }

  const modal =
    open && mounted ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <ModalCardHeader
            title={user ? "계정" : "Mock 로그인"}
            description={
              user
                ? "현재 Mock 세션 정보입니다."
                : "비회원은 읽기만 가능하고, 로그인하면 포스트 작성과 팔로잉 기능을 쓸 수 있습니다."
            }
            onClose={() => setOpen(false)}
          />
          <CardContent className="pt-0">
            {user ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <RadioPillGroup
                  groupClassName="rounded-full border border-border/70 bg-card p-1"
                  columnsClassName="grid-cols-2"
                  name="auth-mode"
                  value={mode}
                  options={[
                    { value: "login", label: "로그인" },
                    { value: "signup", label: "회원가입" },
                  ]}
                  onChange={(value) => {
                    setError("");
                    setMode(value as AuthMode);
                  }}
                />
                {mode === "login" ? (
                  <form className="space-y-4" onSubmit={submitLogin}>
                    <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                      테스트 계정: {demoAccount.email} / {demoAccount.password}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mock-login-email">아이디(이메일)</Label>
                      <Input
                        id="mock-login-email"
                        autoComplete="username"
                        placeholder="easyh@gamelog.local"
                        value={loginForm.email}
                        onChange={(event) =>
                          setLoginForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mock-login-password">비밀번호</Label>
                      <Input
                        id="mock-login-password"
                        autoComplete="current-password"
                        type="password"
                        placeholder="비밀번호"
                        value={loginForm.password}
                        onChange={(event) =>
                          setLoginForm((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                      />
                    </div>
                    {error ? (
                      <p className="text-sm text-destructive">{error}</p>
                    ) : null}
                    <div className="flex justify-end">
                      <Button type="submit" disabled={saving}>
                        로그인
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form className="space-y-4" onSubmit={submitSignup}>
                    <div className="space-y-2">
                      <Label htmlFor="mock-signup-name">표시 이름</Label>
                      <Input
                        id="mock-signup-name"
                        placeholder="표시 이름"
                        value={signupForm.displayName}
                        onChange={(event) =>
                          setSignupForm((current) => ({
                            ...current,
                            displayName: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mock-signup-email">아이디(이메일)</Label>
                      <Input
                        id="mock-signup-email"
                        autoComplete="username"
                        placeholder="name@gamelog.local"
                        value={signupForm.email}
                        onChange={(event) =>
                          setSignupForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mock-signup-password">비밀번호</Label>
                      <Input
                        id="mock-signup-password"
                        autoComplete="new-password"
                        type="password"
                        placeholder="새 비밀번호"
                        value={signupForm.password}
                        onChange={(event) =>
                          setSignupForm((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                      />
                    </div>
                    {error ? (
                      <p className="text-sm text-destructive">{error}</p>
                    ) : null}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={
                          saving ||
                          !signupForm.displayName.trim() ||
                          !signupForm.email.trim() ||
                          !signupForm.password.trim()
                        }
                      >
                        회원가입
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    ) : null;

  return (
    <>
      <Button
        className="min-w-24 justify-between rounded-full px-3"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <span className="flex min-w-0 items-center gap-2">
          {user ? <UserRound className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
          <span className="max-w-24 truncate">
            {user ? user.displayName : "로그인"}
          </span>
        </span>
      </Button>
      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}
