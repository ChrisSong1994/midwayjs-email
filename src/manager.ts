import {
  Config,
  Init,
  Inject,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
  ServiceFactory,
  delegateTargetPrototypeMethod,
  MidwayCommonError,
} from "@midwayjs/core";
import * as Mailer from "nodemailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";
import * as SMTPPool from "nodemailer/lib/smtp-pool";
import * as SendmailTransport from "nodemailer/lib/sendmail-transport";
import * as StreamTransport from "nodemailer/lib/stream-transport";
import * as JSONTransport from "nodemailer/lib/json-transport";
import * as SESTransport from "nodemailer/lib/ses-transport";

type Options =
  | SMTPTransport.Options
  | SMTPPool.Options
  | SendmailTransport.Options
  | StreamTransport.Options
  | JSONTransport.Options
  | SESTransport.Options
  | Mailer.TransportOptions;

export type TransportType =
  | Options
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
export class EmailServiceFactory extends ServiceFactory<Mailer.Transporter> {
  @Config("email")
  emailConfig;

  @Init()
  async init() {
    await this.initClients(this.emailConfig);
  }

  @Logger("coreLogger")
  logger;

  async createClient(config: Options): Promise<Mailer.Transporter> {
    const transporter = Mailer.createTransport(config);
    return transporter;
  }

  getName() {
    return "email";
  }
}

@Provide()
@Scope(ScopeEnum.Singleton)
export class EmailService {
  @Inject()
  private serviceFactory: EmailServiceFactory;

  private instance: Mailer.Transport;

  @Init()
  async init() {
    this.instance = this.serviceFactory.get(
      this.serviceFactory.getDefaultClientName?.() || "default"
    );
    if (!this.instance) {
      throw new MidwayCommonError("emial default instance not found.");
    }
  }
}

delegateTargetPrototypeMethod(EmailService, [Mailer]);
