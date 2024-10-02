import React from 'react';

import { Provider } from 'starfx/react';

import { render } from '@testing-library/react';

import { schema } from '../src/api';
import { setupStore } from '../src/store';

const customRender = (ui, options) => {
  const AllTheProviders = ({ children }) => {
    const store = setupStore({});
    return (
      <Provider schema={schema} store={store}>
        {children}
      </Provider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
