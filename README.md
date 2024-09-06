![Cover Fileforge](https://github.com/OnedocLabs/react-print-pdf/assets/33000377/6861210a-5f0d-4898-9529-bb13dfa982d1)

<div align="center"><strong>React Print</strong></div>
<div align="center">The new way to build documents.<br />High-quality, unstyled components for creating PDFs.</div>
<br />
<div align="center">
<a href="https://www.fileforge.com/">Fileforge Website</a>
<span> · </span>
<a href="https://github.com/OnedocLabs/">GitHub</a>
<span> · </span>
<a href="https://discord.com/invite/uRJE6e2rgr">Discord</a>
<span> · </span>
<a href="https://docs.fileforge.com/react-print/welcome/getting-started">Documentation</a>
</div>

<br/>

<div class="title-block" style="text-align: center;" align="center">

[![GitHub Repo stars](https://img.shields.io/github/stars/Onedoclabs/react-print)](https://github.com/OnedocLabs/react-print)
[![Discord](https://img.shields.io/discord/1182321379081736192?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/uRJE6e2rgr)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/FileforgeLabs)](https://twitter.com/FileforgeLabs)
[![YC](https://img.shields.io/badge/Y%20Combinator-W24-orange?style=flat-square)](https://www.ycombinator.com/companies/fileforge)

</div>

---

# Demo Highlights 🎥

https://github.com/OnedocLabs/react-print-pdf/assets/33000377/0d8815a7-e858-4541-ba13-325d56f26c69

# Key Features 🎯

- **Easy to use**: Build your first PDF with react-print-pdf in less than 5 minutes.
- **Open source**: Freedom is beautiful, and so is Fileforge. React-print-pdf is open source and free to use.
- **Components & Templates**: Kickstart your next document by using our list of components and template created by Fileforge's Team and the community.
- **100% Layout's control**: Unlike other solutions, you have complete control over 100% of your layout, including margins, headers, footers, and more.
- **Integrate dynamic data to your PDF**: Streamline data from your database and integrate it seamlessly into your PDFs.

# Introduction ℹ️

A collection of high-quality, unstyled components for creating beautiful PDFs using React and TypeScript. Forget about docx, latex, or painful outdated libraries. With _react-print-pdf_, embrace a new way to create PDFs, designed by and for developers.

# Why❓

We believe documents are at the core of communication—invoices, contracts, resumes, brochures, etc. They are the primary method for exchanging information with others professionally. So, why do we continue to use decades-old technology to create them? We believe you deserve better. Document production needs to be modernized. Start today and create your next PDF the same way you build a web app. And yes, this includes automating data integration into your documents. Say hello to _react-print-pdf_.

# How does it differ from other solutions? 🧐

Unlike other solutions, _react-print-pdf_ gives you complete control over your documents, allowing you to design complex layouts with features like footnotes, headers, margins, and more. Additionally, it enables you to track and analyze specific parts of your document, and build and update charts using data from your database. And this is just the beginning—our team and the community will continue to develop great features to simplify the PDF generation process.

![Legacy Solution vs. React-print-pdf](https://github.com/OnedocLabs/react-print-pdf/assets/33000377/a8834372-047e-46ff-a4ff-26083df88594)

# Getting started 🚀

## 1. Installation 💿

Get the _react-print_ component library.

### With npm

```sh npm
npm install @fileforge/react-print
```

### With yarn

```sh yarn
yarn add @fileforge/react-print
```

### With pnpm

```sh pnpm
pnpm add @fileforge/react-print
```

## 2. Import component ↪️

Import the components you need to your PDF template from our list of pre-build components :

```javascript
import { PageTop, PageBottom, PageBreak } from "@fileforge/react-print";
```

## 3. Integrate in your document 📄

Integrate your components and include styles where needed.

```javascript
export const Document = ({ props }) => {
  return (
    <div>
      <PageTop>
        <span>Hello #1</span>
      </PageTop>
      <div>Hello #2</div>
      <PageBottom>
        <div className="text-gray-400 text-sm">Hello #3</div>
      </PageBottom>
      <PageBreak />
      <span>Hello #4, but on a new page ! </span>
    </div>
  );
};
```

## 4. Generate HTML 💻

```javascript
import { compile } from "@fileforge/react-print";

const html = await compile(<Document />);
```

# Components 🗂️

A set of standard components to help you build amazing documents without having to deal with the mess of creating complex layouts and maintaining archaic markup. Help us extend this list by actively contributing and adding your favorite components!

[Browse all currently supported components →](https://docs.fileforge.com/react-print/components/compile/compile)

> [!NOTE]
> Help us extend this list by actively contributing and adding your favorite components!

# Integrations 🔗

PDF designed with _react-print-print_ can be generated, hosted (and more) with your preferred document management providers.

- [Fileforge](https://app.fileforge.com/login) : HTML to PDF, cloud hosting, analytics and more.

# Contributing 🫂

This project is open-source and is intended to be maintained and built by and for developers. </br>

Wanna help ? Awesome! There are many ways you can contribute! Take a look at:

- [Contributing Guide](https://docs.fileforge.com/react-print/contributing/contributing)

# Authors 🧑‍💻

- Auguste L. ([@thisisnotFranck](https://twitter.com/thisisnotfranck))
- Pierre D. ([@pierre_dge120](https://twitter.com/pedro_dge120))
- Titouan L. ([@titouan325](https://twitter.com/titouan325))

# License 📜

[License](https://github.com/OnedocLabs/react-print/blob/main/LICENSE.md)

# Join the movement ! 🚀

## Activity

![Alt](https://repobeats.axiom.co/api/embed/1cdb5f15e29e4e5a9388c982a039eaa97a52fdf9.svg "Repobeats analytics image")

## Contributors ✨

<a href="https://github.com/onedoclabs/react-print-pdf/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=onedoclabs/react-print-pdf" />
</a>

## Star History 🌟

<a href="https://star-history.com/#Onedoclabs/react-print-pdf&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Onedoclabs/react-print&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Onedoclabs/react-print&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Onedoclabs/react-print&type=Date" />
  </picture>
</a>

<div class="title-block" style="text-align: center;" align="center">

[![GitHub Repo stars](https://img.shields.io/github/stars/Onedoclabs/react-print)](https://github.com/OnedocLabs/react-print)
[![Discord](https://img.shields.io/discord/1182321379081736192?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/uRJE6e2rgr)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/FileforgeLabs)](https://twitter.com/FileforgeLabs)
[![YC](https://img.shields.io/badge/Y%20Combinator-W24-orange?style=flat-square)](https://www.ycombinator.com/companies/fileforge)

</div>

---
