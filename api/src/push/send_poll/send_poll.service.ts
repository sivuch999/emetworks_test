import { Client, Message } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContentBody, ContentFooter, TemplateContent } from '../../template/flex.template';

@Injectable()
export class SendPollService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  public async SendCreatePoll(oa: any, question: string, answer: any[], pollId: string): Promise<any> {
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
      ]
    }
    
    let footer: ContentFooter = {
      type: 'box',
      layout: 'vertical',
      contents: answer.map((e: any) =>
        {
          return {
            'type': 'button',
            'style': 'secondary',
            'height': 'sm',
            'action': {
              'type': 'postback',
              'label': e.label,
              'data': e.data,
              'displayText': e.text
            }
          }
        }
      )
    }

    footer.contents.push(
      {
        'type': 'button',
        'style': 'primary',
        'height': 'md',
        'action': {
          'type': 'postback',
          'label': `ปิดโหวต`,
          'data': pollId,
          'displayText': `ปิดโหวตโพล ${question}`
        },
        'color': '#CC0033'
     }
    )

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

    const pushMsg: Message[] = [
      {
        type: 'text',
        text: `โพล ${question} ปิดโหวตแล้วค่ะ`
      }
    ]

    await client.pushMessage(oa.to, pushMsg).catch((e: any) => { console.log(e) });

  }

  public async SendSummaryPoll(oa: any, pushMsg: Message[]): Promise<any> {
    const client = new Client(
      {
        'channelAccessToken': oa.lineMessageToken,
        'channelSecret': oa.lineMessageSecret 
      },
    )
    if (!client) {
      throw 'verify line token failed'
    }

    await client.pushMessage(oa.to, pushMsg).catch((e: any) => { console.log(e) })

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