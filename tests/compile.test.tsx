import { expect, test } from "vitest";
import { Tailwind, compile } from "../dist/index.mjs";
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

test("smoke test tailwind", async () => {
  const TestComponent = () => {
    return (
      <Tailwind>
        {Array.from({ length: 1000000 }).map((_, i) => (
          <div key={i} className="bg-red-500">
            Test
          </div>
        ))}
      </Tailwind>
    );
  };

  const html = await compile(<TestComponent />);

  expect(html).toContain("rgba(239, 68, 68");
});

test("works with tailwind dark", async () => {
  const TestComponent = () => (
    <Tailwind
      config={{
        darkMode: "class",
      }}
    >
      <div className="dark:bg-red-500">Test</div>
    </Tailwind>
  );

  const html = await compile(<TestComponent />);

  expect(html).toContain("rgba(239, 68, 68");
});
