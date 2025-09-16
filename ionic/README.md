# Auction App - Ionic Capacitor

تم تحويل تطبيق المزادات إلى تطبيق موبايل باستخدام Ionic Capacitor.

## المتطلبات

### لتطوير Android:
- Android Studio
- Android SDK
- Java Development Kit (JDK)

### لتطوير iOS:
- Xcode (macOS فقط)
- iOS SDK
- Apple Developer Account للنشر

## الأوامر المهمة

### تشغيل التطبيق في المتصفح:
```bash
npm run dev
```

### بناء التطبيق:
```bash
npm run build
```

### مزامنة التغييرات مع المنصات:
```bash
npx cap sync
```

### فتح مشروع Android:
```bash
npx cap open android
```

### فتح مشروع iOS:
```bash
npx cap open ios
```

### إضافة منصة جديدة:
```bash
npx cap add android
npx cap add ios
```

## خطوات النشر

### Android (Google Play):
1. فتح المشروع في Android Studio: `npx cap open android`
2. بناء APK أو AAB للإنتاج
3. رفع التطبيق على Google Play Console
4. تكلفة حساب المطور: $25 (مرة واحدة)

### iOS (App Store):
1. فتح المشروع في Xcode: `npx cap open ios`
2. إعداد الشهادات والملفات الشخصية
3. بناء التطبيق للإنتاج
4. رفع التطبيق على App Store Connect
5. تكلفة حساب المطور: $99/سنة

## الملفات المهمة

- `capacitor.config.ts` - إعدادات Capacitor
- `android/` - مشروع Android الأصلي
- `ios/` - مشروع iOS الأصلي
- `dist/` - ملفات التطبيق المبنية

## ملاحظات

- التطبيق يحافظ على نفس الكود والتصميم الأصلي
- يمكن إضافة مكونات إضافية من Capacitor للوصول لمميزات الجهاز
- التطبيق جاهز للاختبار والنشر على المتاجر
