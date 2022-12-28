import { Client, Message } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { ContentBody, ContentFooter, TemplateContent } from '../../template/flex.template';

@Injectable()
export class SendPollService {

  public async SendCreatePoll(oa: any, question: string, answer: any[], expired: string): Promise<any> {
    const client = new Client(
      {
        'channelAccessToken': oa.lineMessageToken,
        'channelSecret': oa.lineMessageSecret 
      },
    )
    if (!client) {
      throw 'verify line token failed'
    }

    let body: ContentBody = {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          'type': 'text',
          'text': question,
          'weight': 'bold',
          'size': 'lg',
          'wrap': true,
        },
        {
          'type': 'box',
          'layout': 'vertical',
          'margin': 'lg',
          'spacing': 'sm',
          'contents': [
            {
              'type': 'box',
              'layout': 'baseline',
              'spacing': 'sm',
              'contents': [
                {
                  'type': 'text',
                  'text': 'Expire:',
                  'color': '#aaaaaa',
                  'size': 'sm',
                  'flex': 2
                },
                // {
                //   'type': 'text',
                //   'text': `${expired}`,
                //   'wrap': true,
                //   'color': '#666666',
                //   'size': 'sm',
                //   'flex': 4
                // }
              ]
            }
          ]
        }
      ]
    }
    
    let footer: ContentFooter = {
      type: 'box',
      layout: 'vertical',
      contents: answer.map((e: any) => {
        return {
          'type': 'button',
          'style': 'secondary',
          'height': 'sm',
          // 'action': {
          //   'type': 'message',
          //   'label': e.label,
          //   'text': e.text
          // },
          'action': {
            'type': 'postback',
            'label': e.label,
            'data': e.data,
            'displayText': e.text
          }
        }
      })
    }

    const pushMsg: Message[] = [TemplateContent(question, 'bubble', body, footer)]
    await client.pushMessage(oa.to, pushMsg).catch((e: any) => { console.log(e) })

  }

  public async SendClosedPoll(oa: any, id: number, question: string): Promise<any> {
    const client = new Client(
      {
        'channelAccessToken': oa.lineMessageToken,
        'channelSecret': oa.lineMessageSecret 
      },
    )
    if (!client) {
      throw 'verify line token failed'
    }

    const qCode = id.toString().padStart(5, "0")
    const pushMsg: Message[] = [
      {
        type: 'text',
        text: `(${qCode}: ${question}) ปิดโหวตแล้วค่ะ`
      }
    ]

    await client.pushMessage(oa.to, pushMsg).catch((e: any) => { console.log(e) });

  }

  public async SendSummaryPoll(oa: any, message: string): Promise<any> {
    const client = new Client(
      {
        'channelAccessToken': oa.lineMessageToken,
        'channelSecret': oa.lineMessageSecret 
      },
    )
    if (!client) {
      throw 'verify line token failed'
    }

    const pushMsg: Message[] = [
      {
        type: 'text',
        text: message
      }
    ]

    await client.pushMessage(oa.to, pushMsg).catch((e: any) => { console.log(e) });

  }

  public async SendReminderPoll(oa: any, push: any[]): Promise<any> {
    const client = new Client(
      {
        'channelAccessToken': oa.lineMessageToken,
        'channelSecret': oa.lineMessageSecret 
      },
    )
    if (!client) {
      throw 'verify line token failed'
    }

    push.forEach(async (e: any) => {
      await client.pushMessage(e.to, { type: 'text', text: e.message }).catch((e: any) => { console.log(e) });
    });

  }

}