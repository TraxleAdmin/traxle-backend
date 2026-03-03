const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

// 1. ŞANTİYEYE BİLDİRİM: Yeni bir teklif geldiğinde
exports.onnewoffer = onDocumentCreated("offers/{offerId}", async (event) => {
    const snap = event.data;
    if (!snap) return;
    const offer = snap.data();

    const supplierName = offer.bidderName || "Bir Tedarikçi";
    const price = offer.amount || 0;
    const loadId = offer.loadId;

    if (!loadId) return;

    const loadDoc = await admin.firestore().collection("loads").doc(loadId).get();
    if (!loadDoc.exists) return;

    const customerId = loadDoc.data().createdBy;
    if (!customerId) return;

    const customerDoc = await admin.firestore().collection("users").doc(customerId).get();
    const customerData = customerDoc.data();

    if (!customerData || !customerData.fcmToken) return;

    const payload = {
        token: customerData.fcmToken,
        notification: {
            title: "Yeni Teklif Var! 🚜",
            body: `${supplierName}, iş makinesi kiralama ilanınız için ${price} ₺ teklif verdi. Hemen inceleyin.`
        },
        data: { click_action: "FLUTTER_NOTIFICATION_CLICK", type: "offer", loadId: loadId }
    };

    return admin.messaging().send(payload);
});

// 2. TEDARİKÇİYE BİLDİRİM: Teklifi kabul edildiğinde
exports.onofferaccepted = onDocumentUpdated("offers/{offerId}", async (event) => {
    const snap = event.data;
    if (!snap) return;

    const newValue = snap.after.data();
    const previousValue = snap.before.data();

    if (newValue.status === "accepted" && previousValue.status !== "accepted") {
        const supplierId = newValue.bidderId;

        const supplierDoc = await admin.firestore().collection("users").doc(supplierId).get();
        const supplierData = supplierDoc.data();

        if (!supplierData || !supplierData.fcmToken) return;

        const payload = {
            token: supplierData.fcmToken,
            notification: {
                title: "Teklifin Kabul Edildi! 🎉",
                body: "Harika! Şantiye yetkilisi teklifinizi onayladı. Mobilizasyon (sahaya sevk) detayları için hemen iletişime geçin."
            },
            data: { click_action: "FLUTTER_NOTIFICATION_CLICK", type: "accepted", loadId: newValue.loadId || "" }
        };

        return admin.messaging().send(payload);
    }
});

// 3. TÜM TEDARİKÇİLERE BİLDİRİM: Yeni ilan (iş) açıldığında
exports.onloadcreated = onDocumentCreated("loads/{loadId}", async (event) => {
    const snap = event.data;
    if (!snap) return;
    const loadData = snap.data();

    if (loadData.status !== "Bekliyor") return;

    const location = loadData.origin || loadData.city || "Bölgenizde";
    const price = loadData.price || "Teklif Bekleniyor";
    const vehicleType = loadData.vehicleType || "İş Makinesi";

    const payload = {
        notification: {
            title: "🚨 Yeni İş Makinesi Talebi!",
            body: `${location} şantiyesi için ${vehicleType} aranıyor. Bütçe: ₺${price}`,
        },
        data: { type: "new_load", loadId: event.params.loadId, click_action: "FLUTTER_NOTIFICATION_CLICK" }
    };

    const suppliersSnap = await admin.firestore().collection("users").where("role", "==", "driver").get();

    const tokens = [];
    suppliersSnap.forEach((doc) => {
        if (doc.data().fcmToken) tokens.push(doc.data().fcmToken);
    });

    if (tokens.length === 0) return;

    try {
        await admin.messaging().sendEachForMulticast({ tokens, notification: payload.notification, data: payload.data });
    } catch (error) { console.error("Toplu Bildirim hatası:", error); }
});

// 4. SOHBET BİLDİRİMİ
exports.onnewmessage = onDocumentCreated("chats/{chatRoomId}/messages/{messageId}", async (event) => {
    const msg = event.data.data();
    if (!msg || !msg.receiverId) return;

    const [senderDoc, receiverDoc] = await Promise.all([
        admin.firestore().collection("users").doc(msg.senderId).get(),
        admin.firestore().collection("users").doc(msg.receiverId).get()
    ]);

    const receiverData = receiverDoc.data();
    if (!receiverData || !receiverData.fcmToken) return;

    const senderName = senderDoc.data()?.companyName || senderDoc.data()?.name || "Yeni Mesaj";

    const payload = {
        token: receiverData.fcmToken,
        notification: { title: `${senderName} sana mesaj gönderdi 💬`, body: msg.text || "Fotoğraf/Medya" },
        data: { click_action: "FLUTTER_NOTIFICATION_CLICK", type: "chat", chatRoomId: event.params.chatRoomId }
    };

    return admin.messaging().send(payload);
});