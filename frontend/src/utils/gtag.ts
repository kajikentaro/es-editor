export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "";

interface EventProps {
  action: string;
  category: string;
  label: string;
  value?: number;
}
// PVを測定する
export const pageview = (path: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: path,
  });
};

// GAイベントを発火させる
export const event = ({ action, category, label, value }: EventProps) => {
  if (!GA_TRACKING_ID) {
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: JSON.stringify(label),
    value,
  });
};
