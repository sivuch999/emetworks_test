export interface Environment {
  Name?: string;
  Port?: number;
  // Secret?: string;
  Database: Database;
  Line: Line;
}

interface Database {
  host: string;
  username: string;
  password: string;
  port: string;
  name: string;
  synchronize: string;
  logging: string;
}

interface Line {
  Liff?: Liff;
  Notify?: Notify;
  Message?: Message;
  Login?: Login;
  GroupId: string
}

interface Liff {
  Url?: string;
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