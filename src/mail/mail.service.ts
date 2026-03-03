import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    // Şifreyi açıkça yazmıyoruz, .env'den çekiyoruz!
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async sendVerificationCode(email: string, code: string) {
    const msg = {
      to: email,
      from: {
        email: 'contact@traxleapp.com',
        name: 'Traxle Güvenlik',
      },
      subject: 'Traxle Doğrulama Kodunuz',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h3>Traxle'a Hoşgeldiniz!</h3>
          <p>Hesabınızı doğrulamak için güvenlik kodunuz:</p>
          <h1 style="color: #2563EB; font-size: 40px; letter-spacing: 5px;">${code}</h1>
          <p style="color: #666;">Bu kodu lütfen kimseyle paylaşmayın.</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ SendGrid E-posta gönderildi: ${email} -> ${code}`);
      return true;
    } catch (error) {
      console.error('❌ SendGrid E-posta hatası:', error.response?.body || error);
      return false;
    }
  }
}