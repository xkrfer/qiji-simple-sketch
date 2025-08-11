import { StrictMode } from 'react';

import {
  createRootRouteWithContext,
  ErrorComponent,
  Link,
  Outlet,
} from '@tanstack/react-router';

import { Providers } from '@/components/providers';
import type { RootRouterContext } from '@/router';

import type { ErrorComponentProps } from '@tanstack/react-router';
import '@/styles/root.css';

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: RootComponent,
  errorComponent: RootErrorComponent,
});

function RootComponent() {
  return (
    <StrictMode>
      <Providers>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200 [&.active]:text-indigo-600 [&.active]:bg-indigo-50 [&.active]:font-semibold"
                  >
                    🏠 首页
                  </Link>

                  <Link
                    to="/lazy-component"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200 [&.active]:text-indigo-600 [&.active]:bg-indigo-50 [&.active]:font-semibold"
                  >
                    ⚡ 懒加载组件
                  </Link>

                  <Link
                    to="/redirect"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200 [&.active]:text-indigo-600 [&.active]:bg-indigo-50 [&.active]:font-semibold"
                  >
                    🔄 重定向
                  </Link>

                  <Link
                    to="/admin"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200 [&.active]:text-indigo-600 [&.active]:bg-indigo-50 [&.active]:font-semibold"
                  >
                    👑 管理员
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[60vh]">
              <Outlet />
            </div>
          </main>
        </div>
      </Providers>
    </StrictMode>
  );
}

function RootErrorComponent({ error }: ErrorComponentProps) {
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }

  return <ErrorComponent error={error} />;
}
