const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

// Firebase Admin SDK sadece bir kez başlatılır
if (!admin.apps.length) {
    admin.initializeApp();
}

// 🔥 GLOBAL AYARLAR (Türkiye için en hızlısı Europe-West3 - Frankfurt)
setGlobalOptions({
    maxInstances: 10,
    region: "europe-west3"
});

// Modülleri İçe Aktar ve Export Et
exports.stats = require("./stats");
exports.notifications = require("./notifications");
exports.emails = require("./emails");
exports.kyc = require("./kyc");