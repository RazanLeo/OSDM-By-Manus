import { useState } from 'react';
import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';

export default function AddReview() {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t('إضافة تقييم', 'Add Review')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('قيّم تجربتك مع البائع أو المنتج أو الخدمة', 'Rate your experience with the seller, product, or service')}
          </p>
        </div>

        {/* Review Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('تقييمك', 'Your Review')}</CardTitle>
            <CardDescription>
              {t('شارك تجربتك لمساعدة الآخرين', 'Share your experience to help others')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating Stars */}
            <div className="space-y-2">
              <Label>{t('التقييم', 'Rating')}</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {rating === 0 && t('اختر تقييمك', 'Select your rating')}
                {rating === 1 && t('سيء جداً', 'Very Poor')}
                {rating === 2 && t('سيء', 'Poor')}
                {rating === 3 && t('جيد', 'Good')}
                {rating === 4 && t('جيد جداً', 'Very Good')}
                {rating === 5 && t('ممتاز', 'Excellent')}
              </p>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <Label htmlFor="review">{t('التقييم المكتوب', 'Written Review')}</Label>
              <Textarea
                id="review"
                rows={6}
                placeholder={t('اكتب تقييمك هنا...', 'Write your review here...')}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button className="gradient-bg text-white">
                {t('إرسال التقييم', 'Submit Review')}
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                {t('إلغاء', 'Cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>{t('تقييماتك السابقة', 'Your Previous Reviews')}</CardTitle>
            <CardDescription>
              {t('التقييمات التي قدمتها مسبقاً', 'Reviews you have submitted previously')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              {t('لا توجد تقييمات سابقة', 'No previous reviews')}
            </div>
          </CardContent>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}
