import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
    providers: [MailService],
    exports: [MailService], // 👈 ÇOK KRİTİK: AuthModule'ün bunu kullanabilmesi için dışarı açıyoruz.
})
export class MailModule { }