---
title: Introduction
description: Build PDFs using React and TypeScript.
icon: react
---

---
# Getting started 

react-print
## 1. Installation

Get the react-print component library.

<CodeGroup>

```sh npm
npm install -s @onedoc/react-print
```

```sh yarn
yarn add @onedoc/react-print
```

```sh pnpm
pnpm add @onedoc/react-print
```

</CodeGroup>

## 2. Import component

Import a component as follow:

```javascript 
import { PageTop, PageBottom, PageBreak } from '@onedoc/react-print';
```

## 3. Integrate in your document:


```javascript
export const document = ({props}) => {
    return (
            <div>
                <PageTop>
                    <span>Hello #1</span>
                </PageTop>
                <div>
                    Hello #2
                </div>
                <PageBottom>
                    <div className="text-gray-400 text-sm">
                      Hello #3
                    </div>
                </PageBottom>
                <PageBreak />
                <span>Hello #4, but on a new page ! </span>
            </div>
  );
};
```
---
