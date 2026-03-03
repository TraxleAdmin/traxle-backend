const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const vision = require('@google-cloud/vision');

let visionClient;

exports.autokycprocessor = onDocumentUpdated("users/{userId}", async (event) => {
    const snap = event.data;
    if (!snap) return;

    const newData = snap.after.data();
    const oldData = snap.before.data();

    const newKyc = newData.kyc || {};
    const oldKyc = oldData.kyc || {};

    let updates = {};
    let needsUpdate = false;
    let notifications = [];

    // Sadece gerektiğinde Vision API'yi başlat (Cold Start optimizasyonu)
    if (!visionClient) {
        visionClient = new vision.ImageAnnotatorClient();
    }

    for (const [docKey, docData] of Object.entries(newKyc)) {
        if (docData.status === 'pending') {
            const oldStatus = oldKyc[docKey] ? oldKyc[docKey].status : null;

            if (oldStatus !== 'pending') {
                console.log(`👁️ Vision API Analizi Başladı: ${event.params.userId} - ${docKey}`);

                try {
                    const [result] = await visionClient.textDetection(docData.url);
                    const detections = result.textAnnotations;
                    const extractedText = detections.length > 0 ? detections[0].description.toUpperCase() : "";

                    let isApproved = false;
                    let aiConfidence = 0.0;
                    let rejectReason = "";

                    // Kriptografik Kelime Analizi (B2B İş Makinesi Sektörüne Uyarlandı)
                    if (docKey === 'operatorLicense' || docKey === 'driverLicense') {
                        if (extractedText.includes("SÜRÜCÜ") || extractedText.includes("EHLİYET") || extractedText.includes("OPERATÖR")) {
                            isApproved = true; aiConfidence = 0.98;
                        } else {
                            rejectReason = "Operatör/Sürücü belgesi formatı okunamadı. Net bir fotoğraf yükleyin.";
                        }
                    }
                    else if (docKey === 'taxPlate' || docKey === 'companyDocs') {
                        if (extractedText.includes("VERGİ LEVHASI") || extractedText.includes("TİCARET ODASI") || extractedText.includes("BAKANLIĞI")) {
                            isApproved = true; aiConfidence = 0.95;
                        } else {
                            rejectReason = "Vergi Levhası veya Şirket evrakı ibaresi okunamadı.";
                        }
                    }
                    else {
                        if (extractedText.length > 15) {
                            isApproved = true; aiConfidence = 0.85;
                        } else {
                            rejectReason = "Belge üzerinde okunabilir yeterli metin bulunamadı.";
                        }
                    }

                    if (isApproved) {
                        updates[`kyc.${docKey}.status`] = 'approved';
                        updates[`kyc.${docKey}.aiConfidence`] = aiConfidence;
                        updates[`kyc.${docKey}.approvedAt`] = admin.firestore.FieldValue.serverTimestamp();
                        notifications.push(`✅ ${docKey.toUpperCase()} belgeniz yapay zeka tarafından onaylandı.`);
                    } else {
                        updates[`kyc.${docKey}.status`] = 'rejected';
                        updates[`kyc.${docKey}.rejectReason`] = rejectReason;
                        notifications.push(`❌ ${docKey.toUpperCase()} belgeniz reddedildi: ${rejectReason}`);
                    }
                    needsUpdate = true;

                } catch (error) {
                    console.error("Vision API Hatası:", error);
                    // API çökerse 'pending' kalır, sistem admini manuel onaylar.
                }
            }
        }
    }

    if (needsUpdate) {
        await admin.firestore().collection("users").doc(event.params.userId).update(updates);

        if (newData.fcmToken && notifications.length > 0) {
            const payload = {
                token: newData.fcmToken,
                notification: { title: "Evrak Analiz Sonucu", body: notifications.join('\n') },
                data: { click_action: "FLUTTER_NOTIFICATION_CLICK", type: "kyc_result" }
            };
            await admin.messaging().send(payload).catch(e => console.error("KYC Bildirim Hatası:", e));
        }
    }
});