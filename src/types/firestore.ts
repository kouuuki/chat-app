import { FieldValue } from "firebase/firestore";

export type User = {
  uid: string;
  name: string;
  imageUrl?: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type UserChannel = {
  user: string;
  channel: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type Message = {
  text: string;
  user: string;
  channel: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type Channel = {
  title: string;
  lastSendedMessage: string;
  channelId: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};
