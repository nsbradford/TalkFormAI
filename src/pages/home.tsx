import Page from '@/components/layout/Page';
import DashboardMode from '@/components/home/DashboardMode';

export default function HomePage() {
  return (
    <Page pageTitle="Home" user={null}>
      <DashboardMode />
    </Page>
  );
}
