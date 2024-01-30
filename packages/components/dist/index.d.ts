import React from 'react';

declare const RunningH1: ({ before, after }: {
    before?: string | undefined;
    after?: string | undefined;
}) => React.JSX.Element;
declare const RunningH2: ({ before, after }: {
    before?: string | undefined;
    after?: string | undefined;
}) => React.JSX.Element;
declare const RunningH3: ({ before, after }: {
    before?: string | undefined;
    after?: string | undefined;
}) => React.JSX.Element;
declare const RunningH4: ({ before, after }: {
    before?: string | undefined;
    after?: string | undefined;
}) => React.JSX.Element;
declare const RunningH5: ({ before, after }: {
    before?: string | undefined;
    after?: string | undefined;
}) => React.JSX.Element;
declare const RunningH6: ({ before, after }: {
    before?: string | undefined;
    after?: string | undefined;
}) => React.JSX.Element;

declare const PageTop: (props: React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
declare const CurrentPageTop: (props: React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
declare const PageBottom: (props: React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
declare const PageBreak: (props: React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
declare const NoBreak: (props: React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
declare const FloatBottom: (props: any) => React.JSX.Element;

declare const PageNumber: () => React.JSX.Element;
declare const TotalPages: () => React.JSX.Element;

declare const formatters: {
    date: (language: string, options: Intl.DateTimeFormatOptions) => (date: string) => string;
    raw: () => (value: string) => string;
};
interface Frontmatter {
    [key: string]: any;
}
declare const Frontmatter: ({ field, placeholder, formatter, optional, }: {
    field: string;
    placeholder?: string | undefined;
    formatter?: ((value: string) => string) | undefined;
    optional?: boolean | undefined;
}) => string;
declare const FrontmatterProvider: ({ frontmatter, children, }: {
    frontmatter: Frontmatter;
    children: React.ReactNode;
}) => React.JSX.Element;
declare const useFrontmatter: (field: string) => any;

/**
 * Creates an automatically numbered footnote.
 */
declare const Footnote: ({ children, ...props }: {
    /**
     * The text to display in the footnote. This can be rich text.
     */
    children: React.ReactNode;
}) => React.JSX.Element;

type SigTypes = "sender" | "signer" | `signer${number}`;

declare const Signature: ({ company, representative, tag, }: {
    company?: string | undefined;
    representative?: string | undefined;
    tag: SigTypes;
}) => React.JSX.Element;

declare const TrackBox: ({ children, tag, ...props }: React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
    tag: string;
}) => React.JSX.Element;

export { CurrentPageTop, FloatBottom, Footnote, Frontmatter, FrontmatterProvider, NoBreak, PageBottom, PageBreak, PageNumber, PageTop, RunningH1, RunningH2, RunningH3, RunningH4, RunningH5, RunningH6, Signature, TotalPages, TrackBox, formatters, useFrontmatter };
