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