export type LAYOUT = 'vertical' | 'horizontal'

export interface ContentBody {
    type: string,
    layout: LAYOUT,
    contents: any[],
}

export interface ContentFooter {
    type: string,
    layout: LAYOUT,
    contents: any[],
    optional?: any,
}

export const TemplateContent = (
    altText: string,
    type: string = 'bubble', 
    body: ContentBody,
    footer: ContentFooter
): any => {
    const content = {
        'type': type
    }
    if (body) {
        content['body'] = TemplateContentBody(
            body.type,
            body.layout,
            body.contents,
        )
    }
    if (footer) {
        content['footer'] = TemplateContentFooter(
            footer.type,
            footer.layout,
            footer.contents,
            footer.optional
        )
    }

    return TemplateContentMergeToFlex(altText, content)
}

const TemplateContentBody = (
    type: string = 'box',
    layout: LAYOUT = 'vertical',
    contents: any[] = [],
): any => {
    return {
        'type': type,
        'layout': layout,
        'contents': contents
    }
}

const TemplateContentFooter = (
    type: string = 'box',
    layout: LAYOUT = 'vertical',
    contents: any[] = [],
    optional: any = {},
): any => {
    console.log('optional',optional);
    
    return {
        'type': type,
        'layout': layout,
        'spacing': optional.spacing ?? 'sm',
        'contents': contents,
        'flex': optional.flex ?? 0
    }
}

const TemplateContentMergeToFlex = (
    altText: string = 'Flex Message',
    content: any,
): any => {
    return {
        'type': 'flex',
        'altText': altText,
        'contents': content
    }
}