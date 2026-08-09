import assert from "node:assert/strict";
import test from "node:test";
import { authRedirectPath } from "../src/lib/auth";
import { forgotPasswordSchema, resetPasswordSchema, signupSchema } from "../src/lib/auth-schemas";

test("signupSchema rejects short passwords", () => {
  const result = signupSchema.safeParse({
    name: "Amina",
    email: "amina@example.com",
    password: "short",
    confirmPassword: "short",
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.errors[0]?.message ?? "", /at least 12 characters/i);
  }
});

test("signupSchema accepts strong passwords and normalizes email", () => {
  const result = signupSchema.safeParse({
    name: "Amina",
    email: " AMINA@Example.com ",
    password: "StrongPassword123",
    confirmPassword: "StrongPassword123",
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, "amina@example.com");
  }
});

test("forgotPasswordSchema normalizes email", () => {
  const result = forgotPasswordSchema.safeParse({ email: " USER@Example.com " });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, "user@example.com");
  }
});

test("resetPasswordSchema requires a token", () => {
  const result = resetPasswordSchema.safeParse({
    token: "",
    password: "StrongPassword123",
    confirmPassword: "StrongPassword123",
  });

  assert.equal(result.success, false);
});

test("teacher redirect path resolves to teacher dashboard", () => {
  assert.equal(authRedirectPath("teacher"), "/teacher");
});
