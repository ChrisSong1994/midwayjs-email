import { Configuration } from "@midwayjs/core";
import { EmailServiceFactory } from "./manager";

@Configuration({
  namespace: "email",
  importConfigs: [
    {
      default: {
        email: {},
      },
    },
  ],
})
export class EmailConfiguration {
  async onReady(container) {
    await container.getAsync(EmailServiceFactory);
  }
}
