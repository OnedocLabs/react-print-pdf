import { expect, test } from "vitest";
import { Tailwind, compile } from "../dist";
import React from "react";

test("loads in frontend app", async () => {
  expect(compile).toBeDefined();
});

test("works in frontend app", async () => {
  const TestComponent = () => <div>Test</div>;

  const html = await compile(<TestComponent />);

  expect(html).toContain("Test");
});

test("works with tailwind", async () => {
  const TestComponent = () => (
    <Tailwind>
      <div className="bg-red-500">Test</div>
    </Tailwind>
  );

  const html = await compile(<TestComponent />);

  expect(html).toContain("rgba(239, 68, 68");
});
