export type LAYOUT = 'vertical' | 'horizontal';
export interface ContentBody {
    type: string;
    layout: LAYOUT;
    contents: any[];
}
export interface ContentFooter {
    type: string;
    layout: LAYOUT;
    contents: any[];
    optional?: any;
}
export declare const TemplateContent: (altText: string, type: string, body: ContentBody, footer: ContentFooter) => any;
