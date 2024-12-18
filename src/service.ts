import {
  Config,
  Init,
  Provide,
  Scope,
  ScopeEnum,
  MidwayCommonError,
} from "@midwayjs/core";
import * as Mailer from "nodemailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";
import * as SMTPPool from "nodemailer/lib/smtp-pool";
import * as SendmailTransport from "nodemailer/lib/sendmail-transport";
import * as StreamTransport from "nodemailer/lib/stream-transport";
import * as JSONTransport from "nodemailer/lib/json-transport";
import * as SESTransport from "nodemailer/lib/ses-transport";

type MailOptions =
  | SMTPTransport.Options
  | SMTPPool.Options
  | SendmailTransport.Options
  | StreamTransport.Options
  | JSONTransport.Options
  | SESTransport.Options
  | Mailer.TransportOptions;

export type TransportType =
  | MailOptions
  | SMTPTransport
  | SMTPPool
  | SendmailTransport
  | StreamTransport
  | JSONTransport
  | SESTransport
  | Mailer.Transport
  | string;

@Provide()
@Scope(ScopeEnum.Singleton)
export class EmailService {
  @Config("email")
  protected emailConfig: MailOptions;

  private instance: Mailer.Transporter;

  @Init()
  async init() {
    this.instance = Mailer.createTransport(this.emailConfig);

    if (!this.instance) {
      throw new MidwayCommonError("emial default instance not found.");
    }
  }

  async sendMail(
    options: Mailer.SendMailOptions
  ): Promise<Mailer.SentMessageInfo> {
    return this.instance.sendMail(options);
  }
}
