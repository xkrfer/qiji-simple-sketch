import { Provider } from 'jotai';

import { appStore } from './app.store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={appStore}>{children}</Provider>;
}
