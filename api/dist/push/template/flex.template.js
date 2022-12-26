"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateContent = void 0;
const TemplateContent = (altText, type = 'bubble', body, footer) => {
    const content = {
        'type': type,
        'body': TemplateContentBody(body.type, body.layout, body.contents),
        'footer': TemplateContentFooter(footer.type, footer.layout, footer.contents, footer.optional)
    };
    return TemplateContentMergeToFlex(altText, content);
};
exports.TemplateContent = TemplateContent;
const TemplateContentBody = (type = 'box', layout = 'vertical', contents = []) => {
    return {
        'type': type,
        'layout': layout,
        'contents': contents
    };
};
const TemplateContentFooter = (type = 'box', layout = 'vertical', contents = [], optional = {}) => {
    var _a, _b;
    console.log('optional', optional);
    return {
        'type': type,
        'layout': layout,
        'spacing': (_a = optional.spacing) !== null && _a !== void 0 ? _a : 'sm',
        'contents': contents,
        'flex': (_b = optional.flex) !== null && _b !== void 0 ? _b : 0
    };
};
const TemplateContentMergeToFlex = (altText = 'Flex Message', content) => {
    return {
        'type': 'flex',
        'altText': altText,
        'contents': content
    };
};
//# sourceMappingURL=flex.template.js.map