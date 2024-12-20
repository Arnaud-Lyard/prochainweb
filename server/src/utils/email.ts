import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import { Prisma } from '@prisma/client';
import { logger } from '../app';
import { Lang } from '../types/lang';

const smtp = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
};

export default class Email {
  #username: string;
  #to: string;
  #from: string;
  #userId: string;

  constructor(private user: Prisma.UserCreateInput, private url: string) {
    this.#username = user.username.split(' ')[0];
    this.#userId = user.id!;
    this.#to = user.email;
    this.#from = `Prochainweb <arnaud@prochainweb.com>`;
  }

  private newTransport() {
    return nodemailer.createTransport({
      ...smtp,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });
  }

  private async send(template: string, langage: Lang, subject: string) {
    try {
      // Generate HTML template based on the template string
      const html = pug.renderFile(
        `${__dirname}/../views/${langage}/${template}.pug`,
        {
          username: this.#username,
          subject,
          url: this.url,
          unsubscribeUrl: `${process.env.CLIENT_URL}/unsubscribe/${this.#userId
            }`,
        }
      );

      // Create mailOptions
      const mailOptions = {
        from: this.#from,
        to: this.#to,
        subject,
        text: convert(html),
        html,
      };

      // Send email
      const info = await this.newTransport().sendMail(mailOptions);
      // console.log(nodemailer.getTestMessageUrl(info));
    } catch (error) {
      logger.error(`Error during send mail: ${error}`);
    }
  }

  async sendVerificationCode(langage: Lang) {
    const subject =
      langage === 'fr'
        ? `Votre code d'activation de compte`
        : `Your account activation code`;
    await this.send('verificationCode', langage, subject);
  }

  async sendPasswordResetToken(langage: Lang) {
    const subject =
      langage === 'fr'
        ? `Votre réinitialisation de mot de passe (valide pour seulement 10 minutes)`
        : `Your password reset token (valid for only 10 minutes)`;
    await this.send('resetPassword', langage, subject);
  }

  async sendConfirmMessage(langage: Lang) {
    const subject =
      langage === 'fr'
        ? `Informations suite à votre inscription`
        : `Information following your registration`;
    await this.send('confirmation', langage, subject);
  }

  async sendNewPostMessage(langage: Lang) {
    const subject =
      langage === 'fr'
        ? `Nouveau article sur ProchainWeb`
        : `New post on ProchainWeb`;
    await this.send('newPost', langage, subject);
  }

  async sendNewCommentMessage(langage: Lang) {
    const subject =
      langage === 'fr'
        ? `Nouveau commentaire sur ProchainWeb`
        : `New comment on ProchainWeb`;
    await this.send('newComment', langage, subject);
  }
}
