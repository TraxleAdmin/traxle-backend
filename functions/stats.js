const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

const db = admin.firestore();

exports.onusercreated = onDocumentCreated("users/{userId}", async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();

    // Uygulamada rol 'driver' ise, biz onu Tedarikçi (Makine Sahibi) kabul ediyoruz
    if (data.role === "driver") {
        await db.collection("system").doc("stats").set({
            totalSuppliers: admin.firestore.FieldValue.increment(1)
        }, { merge: true });
    }
});

exports.onloadcreated = onDocumentCreated("loads/{loadId}", async (event) => {
    const snap = event.data;
    if (!snap) return;

    await db.collection("system").doc("stats").set({
        totalAds: admin.firestore.FieldValue.increment(1) // Yeni ilan sayısı
    }, { merge: true });
});

exports.onloadupdated = onDocumentUpdated("loads/{loadId}", async (event) => {
    const snap = event.data;
    if (!snap) return;

    const before = snap.before.data();
    const after = snap.after.data();

    // Operasyon tamamlandığında (Şantiyeden makine çıkış yaptığında/iş bittiğinde)
    if (before.status !== "Tamamlandı" && after.status === "Tamamlandı") {
        await db.collection("system").doc("stats").set({
            completedOperations: admin.firestore.FieldValue.increment(1)
        }, { merge: true });
    }
});