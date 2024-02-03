![React email cover](https://pbs.twimg.com/profile_banners/1733139456645795840/1705969228/1500x500)

<div align="center"><strong>React Print</strong></div>
<div align="center">The new way to build documents.<br />High-quality, unstyled components for creating PDFs.</div>
<br />
<div align="center">
<a href="https://www.onedoclabs.com/">Website</a> 
<span> · </span>
<a href="https://github.com/OnedocLabs/react-print">GitHub</a> 
<span> · </span>
<a href="https://discord.com/invite/uRJE6e2rgr">Discord</a>
</div>

---
# Getting started 

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
