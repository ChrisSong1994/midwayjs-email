# @fett/midwayjs-email

基于 `nodemailer` 开发的 `Midway` 组件，支持 `midwayjs 3`

## 安装依赖

```bash
npm i @fett/midwayjs-email --save
```

## 引入组件

```typescript
import { Configuration } from "@midwayjs/core";
import * as email from "@fett/midwayjs-email";
import { join } from "path";

@Configuration({
  imports: [
    // ...
    email, // 导入 email 组件
  ],
  importConfigs: [join(__dirname, "config")],
})
export class MainConfiguration {}
```

## 配置

`@fett/midwayjs-email` 当前仅提供单客户端模式，配置文件如下：

```json
// src/config/config.default.ts
export default {
  // ...
  email: {
     host: "smtp.163.com",
    secure: true,
    port: 465,
    // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
    auth: {
      user: "xxxxxxx@163.com",
      pass: "xxxxxxxxxxx", //这里是授权密码而不是邮件密码
    },
  },
}

```

## 使用 email 服务

```typescript
import { Provide, Inject } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { EmailService } from "@fett/midwayjs-email";

import { generateRandomCode } from "../utils";

@Provide()
export class AuthService {
  @Inject()
  ctx: Context;

  @Inject()
  emailService: EmailService;

  async sendVerifyCodeToEmail(email: string) {
    const code = generateRandomCode();
    this.ctx.session.code = code;
    this.ctx.session.maxAge = 5 * 60 * 1000; 

    await this.emailService.sendMail({
      from: "XXX <xxxx@163.com>",
      to: email,
      subject: "亲爱的用户，您好：",
      text: `您的注册验证码是${code},验证码有效期是5分钟。`,
    });
  }
}
```
