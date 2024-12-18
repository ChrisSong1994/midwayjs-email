import { Configuration } from "@midwayjs/core";

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
export class EmailConfiguration {}
