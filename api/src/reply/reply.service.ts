
import { Injectable } from '@nestjs/common';
import { ContentBody, TemplateContent } from '../template/flex.template';

@Injectable()
export class ReplyService {
    public async ReplyRequestPoll(altText: string, createUrl: string, closeUrl: string): Promise<any> {
    
        let body: ContentBody = {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "สร้าง",
                    "uri": `${createUrl}`
                  },
                  "color": "#FFFFFF"
                }
              ],
              "backgroundColor": "#78bf7d"
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "ปิดโพล",
                    "uri": `${closeUrl}`
                  },
                  "color": "#000000"
                }
              ],
              "backgroundColor": "#dbbc62"
            }
          ]
        }
    
        return TemplateContent(`${altText}`, 'bubble', body, null)
    
    }
}

