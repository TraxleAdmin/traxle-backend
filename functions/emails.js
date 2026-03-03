const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

if (!admin.apps.length) {
    admin.initializeApp();
    console.log("✅ Firebase Admin başlatıldı.");
}

// 1. YENİ KULLANICI KAYIT OLDUĞUNDA (HOŞ GELDİN MAİLİ)
exports.onusercreatedsendmail = onDocumentCreated("users/{userId}", async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();

    const email = data.email;
    const firstName = data.companyName || data.name || "Traxle Üyesi";

    if (!email) return;

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) return;
    sgMail.setApiKey(apiKey);

    try {
        const loginLink = "https://www.traxleapp.com/giris";

        const msg = {
            to: email,
            // 🔥 GÜNCELLENDİ: Artık no-reply adresinden gidecek
            from: { email: 'no-reply@traxleapp.com', name: 'Traxle Sistemleri' },
            templateId: 'd-648edc7fc44545609ff978da4583711d',
            dynamicTemplateData: { firstName: firstName, verificationUrl: loginLink }
        };

        await sgMail.send(msg);
        console.log(`✅ Başarılı: ${email} adresine hoş geldin e-postası fırlatıldı.`);
    } catch (error) {
        console.error("❌ SendGrid Hatası (Hoş Geldin):", error);
    }
});

// 2. ŞİFRE SIFIRLAMA TALEBİ GELDİĞİNDE (KUSURSUZ B PLANI)
exports.onpasswordresetrequest = onDocumentCreated("password_resets/{docId}", async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();

    const email = data.email;
    const firstName = data.firstName || data.name || "Kullanıcı";

    if (!email) return;

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) return;
    sgMail.setApiKey(apiKey);

    try {
        console.log(`🔄 ${email} için SendGrid üzerinden şifre sıfırlama başlatılıyor...`);

        const resetLink = `https://www.traxleapp.com/sifre-yenile?token=${event.params.docId}&email=${encodeURIComponent(email)}`;

        const msg = {
            to: email,
            // 🔥 GÜNCELLENDİ: Artık no-reply adresinden gidecek
            from: { email: 'no-reply@traxleapp.com', name: 'Traxle Destek Ekibi' },
            templateId: 'd-ab0c1c79e0344d45b0b4f6a11f9dec1d',
            dynamicTemplateData: { firstName: firstName, resetUrl: resetLink }
        };

        await sgMail.send(msg);
        console.log(`✅ Güvenlik: ${email} adresine şifre sıfırlama maili SENDGRID ile fırlatıldı.`);

        await snap.ref.delete();
    } catch (error) {
        console.error("❌ Şifre Sıfırlama Hatası:", error);
    }
});