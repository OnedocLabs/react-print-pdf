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
<span> · </span>
<a href="https://docs.onedoclabs.com">Documentation</a>
</div>

---
# Introduction

A collection of high-quality, unstyled components for creating beautiful PDFs using React and TypeScript. Forget about docx, latex, or painful outdates libraries. With *react-print*, embrace a new way to create PDFs, designed by and for developers. 

# Why 

We believe documents are at the core of communication—invoices, contracts, resumes, brochures, etc. They are the primary method for exchanging information with others professionally. So, why do we continue to use decades-old technology to create them? We believe you deserve better. Document production needs to be modernized. Start today and create your next PDF the same way you build a web app. And yes, this includes automating data integration into your documents. Say hello to *react-print*.

# Getting started 

## 1. Installation

Get the *react-print* component library.

### With npm 
```sh npm
npm install -s @onedoc/react-print
```
### With yarn
```sh yarn
yarn add @onedoc/react-print
```
### With pnpm
```sh pnpm
pnpm add @onedoc/react-print
```

## 2. Import component

Import the components you need to your PDF template from our list of pre-build components :

```javascript 
import { PageTop, PageBottom, PageBreak } from '@onedoc/react-print';
```

## 3. Integrate in your document:

Integrate your components and include styles where needed.

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

# Components
A set of standard components to help you build amazing documents without having to deal with the mess of creating complex layouts and maintaining archaic markup. Help us extend this list by actively contributing and adding your favorite components!

* [Footnote](https://github.com/OnedocLabs/react-print/tree/main/src/Footnote)
* [Shell](https://github.com/OnedocLabs/react-print/tree/main/src/Shell)
* [Running Header](https://github.com/OnedocLabs/react-print/tree/main/src/RunningHeader)

> [!NOTE]
> Help us extend this list by actively contributing and adding your favorite components!

# Integrations

PDF created with *react-print* can generated, hosted (and more) with your preferred document management providers.

* [Onedoc](https://app.onedoclabs.com/login) **(our preferred system)**
* Others *(coming soon..)*

# Contributing

This project is open-source and is intended to be maintained and built by and for developers. </br>

Wanna help ? Awesome! There are many ways you can contribute ! Take a look at: 

* [Contributing Guide](www.google.com)

# Authors 

* Auguste L. ([@thisisnotFranck](https://twitter.com/thisisnotfranck))
* Pierre D. ([@pierre_dge120](https://twitter.com/pedro_dge120))
* Titouan L. ([@titouan325](https://twitter.com/titouan325))

# License

[MIT License](https://github.com/OnedocLabs/react-print/blob/main/LICENSE.md)

# Join the movement !

![React-pdf example](https://github.com/OnedocLabs/react-print/assets/33000377/96b955c2-5014-4a0d-b246-bc7839d977ce)



<div class="title-block" style="text-align: center;" align="center">

[![GitHub Repo stars](https://img.shields.io/github/stars/Onedoclabs/react-print)](https://github.com/OnedocLabs/react-print)
[![Discord](https://img.shields.io/discord/1182321379081736192?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/uRJE6e2rgr)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/Onedoclabs)](https://twitter.com/Onedoclabs)


</div>

---
