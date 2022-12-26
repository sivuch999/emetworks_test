export interface Environment {
  Name?: string;
  Port?: number;
  Secret?: string;
  Line: Line;
}

interface Line {
  Notify?: Notify;
  Message?: Message;
  Login?: Login;
  GroupId: string
}

interface Notify {
  Token?: string;
}

interface Message {
  Secret?: string;
  Token?: string;
}

interface Login {
  ClientId?: string;
}